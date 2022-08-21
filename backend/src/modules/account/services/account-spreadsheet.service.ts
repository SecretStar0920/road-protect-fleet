import { catchError, mergeMap, tap } from 'rxjs/operators';
import { CreateAccountV1Service } from '@modules/account/services/create-account-v1.service';
import { EMPTY, from } from 'rxjs';
import { isEmpty, keyBy, merge, remove } from 'lodash';
import { Account } from '@entities';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { plainToClass } from 'class-transformer';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { validate, ValidationError } from 'class-validator';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { validatorExceptionFactoryString } from '@modules/shared/helpers/validator-exception-factory.helper';

import { CreateAccountSpreadsheetDto } from '@modules/account/controllers/create-account-spreadsheet.dto';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Injectable()
export class AccountSpreadsheetService extends SpreadsheetService<CreateAccountSpreadsheetDto> {
    constructor(
        protected logger: Logger,
        private createAccountService: CreateAccountV1Service,
        protected createDataSpreadsheetService: XlsxService,
        protected createDocumentService: CreateDocumentService,
    ) {
        super(createDataSpreadsheetService, createDocumentService);
    }

    async checkValidity(spreadsheetData: any[]): Promise<UploadSpreadsheetResult<CreateAccountSpreadsheetDto>> {
        const results: UploadSpreadsheetResult<CreateAccountSpreadsheetDto> = new UploadSpreadsheetResult<CreateAccountSpreadsheetDto>();
        await this.checkDtoValid(spreadsheetData, results);
        await this.checkDatabaseValid(results);
        return results;
    }

    async checkDtoValid(data: any[], results: UploadSpreadsheetResult<CreateAccountSpreadsheetDto>): Promise<void> {
        this.logger.debug({ message: 'Checking Dto valid', detail: undefined, fn: this.checkDtoValid.name });
        // Check row by row
        for (const row of data) {
            const item = plainToClass(CreateAccountSpreadsheetDto, row);
            const errors: ValidationError[] = await validate(item);
            if (!isEmpty(errors)) {
                results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Store invalid
            } else {
                results.valid.push(item); // Store valid
            }
        }
        this.logger.debug({ message: 'Dto validity counts: ', detail: results.counts, fn: this.verify.name });
    }

    async checkDatabaseValid(results: UploadSpreadsheetResult<CreateAccountSpreadsheetDto>): Promise<void> {
        // Check database valid
        this.logger.debug({ message: 'Checking database valid', detail: undefined, fn: this.checkDatabaseValid.name });
        // Only check if there are valid results so far
        if (!isEmpty(results.valid)) {
            // Build query
            const query = await Account.createQueryBuilder('account')
                .select(['account.identifier', 'account.name'])
                .andWhere('account.identifier IN (:...identifiers)', { identifiers: results.valid.map((unique) => unique.identifier) })
                .orWhere('account.name IN (:...names)', { names: results.valid.map((unique) => unique.name) });
            const found: any[] = await query.getMany();

            // for each not unique we need to remove it from the valid array and move it to the invalid array
            const foundIdentifiers = keyBy(found, (i) => `${i.identifier}`);
            const foundNames = keyBy(found, (i) => `${i.name}`);
            remove(results.valid, (item) => {
                const errors: ValidationError[] = [];
                if (foundIdentifiers[`${item.identifier}`]) {
                    errors.push({
                        property: 'identifier',
                        constraints: { unique: `An account with this identifier already exists` },
                        children: [],
                    });
                }
                if (foundNames[`${item.name}`]) {
                    errors.push({
                        property: 'name',
                        constraints: { unique: `An account with this name already exists` },
                        children: [],
                    });
                }
                if (!isEmpty(errors)) {
                    results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) }));
                    return true;
                }
                return false;
            });
        }
        this.logger.debug({ message: 'Database validity counts: ', detail: results.counts, fn: this.verify.name });
    }

    async verify(dto: SpreadsheetUploadDto, file: MulterFile) {
        const spreadsheetData = await this.getSpreadsheetData(dto, file);

        this.logger.debug({ message: 'Verifying', detail: spreadsheetData.length, fn: this.verify.name });

        const results = await this.checkValidity(spreadsheetData);

        return SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );
    }

    async upload(dto: SpreadsheetUploadDto, file: MulterFile, socket: DistributedWebsocket) {
        // Use verification function so we only try create valid items
        const spreadsheetData = await this.getSpreadsheetData(dto, file);
        const verifyResults = await this.checkValidity(spreadsheetData);
        const results: UploadSpreadsheetResult<CreateAccountSpreadsheetDto> = new UploadSpreadsheetResult<CreateAccountSpreadsheetDto>();

        this.logger.log({ message: 'Uploading valid accounts', detail: verifyResults.valid.length, fn: this.upload.name });

        this.startNotify({ socket });
        const total = verifyResults.valid.length;

        /**
         * Using a mixture of observables and promises to achieve
         * concurrent creates
         */
        const jobs = from(verifyResults.valid).pipe(
            // For each valid result attempt to concurrently perform an action
            mergeMap((item) => {
                return from(this.createAccountService.createAccountFromSpreadsheet(item)).pipe(
                    // If the job fails push to invalid results
                    catchError((e) => {
                        this.logger.warn({
                            message: 'Failed to upload account',
                            detail: {
                                error: e.message,
                                stack: e.stack,
                            },
                            fn: this.upload.name,
                        });
                        results.invalid.push(this.createErrorItem(item, e));

                        this.progressNotify({ socket, counts: { ...results.counts, total } });

                        return EMPTY;
                    }),
                    // If no errors, push to valid results
                    tap((savedAccount) => {
                        results.valid.push(item);
                        this.progressNotify({ socket, counts: { ...results.counts, total } });
                    }),
                );
                // Concurrency
            }, 5),
        );

        await jobs.toPromise();

        this.logger.log({ message: 'Uploaded accounts', detail: results.valid.length, fn: this.upload.name });
        const finalResult = SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );

        this.endNotify({ socket, result: finalResult });
    }

    async generateValidDocument(data: any): Promise<number> {
        return super.generateValidDocument(data, 'valid-accounts', 'account-uploads');
    }

    async generateInvalidDocument(data: any): Promise<number> {
        return super.generateInvalidDocument(data, 'invalid-accounts', 'account-uploads');
    }
}
