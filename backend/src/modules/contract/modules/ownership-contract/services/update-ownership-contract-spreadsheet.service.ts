import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, from } from 'rxjs';
import { isEmpty, merge } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { plainToClass } from 'class-transformer';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { validate, ValidationError } from 'class-validator';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { XlsxService } from '@modules/shared/modules/spreadsheet/services/xlsx.service';
import { validatorExceptionFactoryString } from '@modules/shared/helpers/validator-exception-factory.helper';
import { Namespace } from 'socket.io';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { Config } from '@config/config';
import { UpdateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/update-ownership-contract.dto';
import { UpdateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/update-ownership-contract.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Injectable()
export class UpdateOwnershipContractSpreadsheetService extends SpreadsheetService<UpdateOwnershipContractDto> {
    constructor(
        protected logger: Logger,
        private updateOwnershipContractService: UpdateOwnershipContractService,
        protected createDataSpreadsheetService: XlsxService,
        protected createDocumentService: CreateDocumentService,
    ) {
        super(createDataSpreadsheetService, createDocumentService);
    }

    async checkValidity(spreadsheetData: any[], timezone?: string): Promise<UploadSpreadsheetResult<UpdateOwnershipContractDto>> {
        const results: UploadSpreadsheetResult<UpdateOwnershipContractDto> = new UploadSpreadsheetResult<UpdateOwnershipContractDto>();
        await this.checkDtoValid(spreadsheetData, results, timezone);
        await this.checkDatabaseValid(results);
        return results;
    }

    async checkDtoValid(data: any[], results: UploadSpreadsheetResult<UpdateOwnershipContractDto>, timezone?: string): Promise<void> {
        this.logger.debug({ message: 'Checking Dto valid', detail: undefined, fn: this.checkDtoValid.name });
        // Check row by row
        for (const row of data) {
            const item = plainToClass(UpdateOwnershipContractDto, {
                ...row,
                timezone: timezone || row.timezone || Config.get.app.timezone,
            });
            const errors: ValidationError[] = await validate(item);
            if (!isEmpty(errors)) {
                results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Store invalid
            } else {
                results.valid.push(item); // Store valid
            }
        }
        this.logger.debug({ message: 'Dto validity counts: ', detail: results.counts, fn: this.verify.name });
    }

    async checkDatabaseValid(results: UploadSpreadsheetResult<UpdateOwnershipContractDto>): Promise<void> {
        // Check database valid
        this.logger.debug({ message: 'Checking database valid', detail: undefined, fn: this.checkDatabaseValid.name });
        // Only check if there are valid results so far
        if (!isEmpty(results.valid)) {
            // // Build query
            // const params: any = {};
            // const paramStrings: string[] = [];
            // let uniqueCount = 0;
            // for (const item of results.valid) {
            //     paramStrings.push(`(:noticeNumber${uniqueCount}, :issuerName${uniqueCount})`);
            //     params[`noticeNumber${uniqueCount}`] = item.noticeNumber;
            //     params[`issuerName${uniqueCount}`] = item.issuer;
            //     uniqueCount++;
            // }
            //
            // const query = OwnershipContract.createQueryBuilder('OwnershipContract')
            //     .select(['OwnershipContract.noticeNumber'])
            //     .innerJoin('OwnershipContract.issuer', 'issuer')
            //     .addSelect(['issuer.name', 'issuer.issuerId'])
            //     .andWhere(`( OwnershipContract.noticeNumber, issuer.name ) IN (${paramStrings.join(', ')})`, params);
            //
            // const found: any[] = await query.getMany();
            //
            // // for each not unique we need to remove it from the valid array and move it to the invalid array
            // const foundIdentifiers = keyBy(found, i => `${i.noticeNumber}/${i.issuer.name}`);
            // remove(results.valid, (item) => {
            //     const errors: ValidationError[] = [];
            //     if (foundIdentifiers[`${item.noticeNumber}/${item.issuer}`]) {
            //         errors.push({
            //             property: 'noticeNumber',
            //             constraints: {
            //                 unique: `An ownership contract with this notice number already exists for the provided issuer`
            //             },
            //             children: []
            //         });
            //     }
            //     if (!isEmpty(errors)) {
            //         results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Add error
            //         return true;
            //     }
            //     return false;
            // });
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

    async upload(dto: SpreadsheetUploadDto, file: MulterFile, socket: DistributedWebsocket, timezone?: string) {
        // Use verification function so we only try create valid items
        const spreadsheetData = await this.getSpreadsheetData(dto, file);
        const verifyResults = await this.checkValidity(spreadsheetData, timezone);
        const results: UploadSpreadsheetResult<UpdateOwnershipContractDto> = new UploadSpreadsheetResult<UpdateOwnershipContractDto>();

        this.logger.log({ message: 'Uploading valid ownership contracts', detail: verifyResults.valid.length, fn: this.upload.name });

        this.startNotify({ socket });
        const total = verifyResults.valid.length;
        /**
         * Using a mixture of observables and promises to achieve
         * concurrent creates
         */
        const jobs = from(verifyResults.valid).pipe(
            // For each valid result attempt to concurrently perform an action
            mergeMap((item) => {
                return from(this.updateOwnershipContractService.updateFromSpreadsheet(item)).pipe(
                    // If the job fails push to invalid verifyResults
                    catchError((e) => {
                        this.logger.warn({
                            message: 'Failed to upload ownership contract',
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
                    // If no errors, push to valid verifyResults
                    tap((savedOwnershipContract) => {
                        results.valid.push(item);
                        this.progressNotify({ socket, counts: { ...results.counts, total } });
                    }),
                );
                // Concurrency
            }, 5),
        );

        await jobs.toPromise();

        this.logger.log({ message: 'Uploaded ownership contracts', detail: results.valid.length, fn: this.upload.name });
        const finalResult = SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );

        this.endNotify({ socket, result: finalResult });
    }

    async generateValidDocument(data: any): Promise<number> {
        return super.generateValidDocument(data, 'valid-ownership-contracts', 'ownership-contract-uploads');
    }

    async generateInvalidDocument(data: any): Promise<number> {
        return super.generateInvalidDocument(data, 'invalid-ownership-contracts', 'ownership-contract-uploads');
    }
}
