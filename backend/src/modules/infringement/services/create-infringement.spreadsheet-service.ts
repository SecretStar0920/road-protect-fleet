import { catchError, mergeMap, tap } from 'rxjs/operators';
import { CreateInfringementSpreadsheetDto } from '@modules/infringement/controllers/create-infringement.dto';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { EMPTY, from } from 'rxjs';
import { chunk, isEmpty, keyBy, merge, remove } from 'lodash';
import { Infringement } from '@entities';
import { Injectable } from '@nestjs/common';
import { Logger, LoggerClass, LoggerMethod } from '@logger';
import { plainToClass } from 'class-transformer';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { validate, ValidationError } from 'class-validator';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { validatorExceptionFactoryString } from '@modules/shared/helpers/validator-exception-factory.helper';

import { MulterFile } from '@modules/shared/models/multer-file.model';
import { Config } from '@config/config';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Injectable()
@LoggerClass()
export class CreateInfringementSpreadsheetService extends SpreadsheetService<CreateInfringementSpreadsheetDto> {
    constructor(
        protected logger: Logger,
        private createInfringementService: CreateInfringementService,
        protected createDataSpreadsheetService: XlsxService,
        protected createDocumentService: CreateDocumentService,
    ) {
        super(createDataSpreadsheetService, createDocumentService);
    }

    async checkValidity(spreadsheetData: any[], timezone?: string): Promise<UploadSpreadsheetResult<CreateInfringementSpreadsheetDto>> {
        const results: UploadSpreadsheetResult<CreateInfringementSpreadsheetDto> = new UploadSpreadsheetResult<
            CreateInfringementSpreadsheetDto
        >();
        await this.checkDtoValid(spreadsheetData, results, timezone);
        await this.checkDatabaseValid(results);
        return results;
    }

    @LoggerMethod({ logData: false })
    async checkDtoValid(data: any[], results: UploadSpreadsheetResult<CreateInfringementSpreadsheetDto>, timezone?: string): Promise<void> {
        // Check row by row
        for (const row of data) {
            const item = plainToClass(CreateInfringementSpreadsheetDto, {
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
        this.logger.debugV2({ message: 'Dto validity counts: ', detail: results.counts, context: this });
    }

    @LoggerMethod({ logData: false })
    async checkDatabaseValid(results: UploadSpreadsheetResult<CreateInfringementSpreadsheetDto>): Promise<void> {
        // Only check if there are valid results so far
        if (!isEmpty(results.valid)) {
            const chunkedItems = chunk(results.valid, 1000);
            const found: any[] = [];

            for (const batch of chunkedItems) {
                // Build query
                const params: any = {};
                const paramStrings: string[] = [];
                let uniqueCount = 0;
                for (const item of batch) {
                    paramStrings.push(`(:noticeNumber${uniqueCount}, :issuerName${uniqueCount})`);
                    params[`noticeNumber${uniqueCount}`] = item.noticeNumber;
                    params[`issuerName${uniqueCount}`] = item.issuer;
                    uniqueCount++;
                }

                const query = Infringement.createQueryBuilder('infringement')
                    .select(['infringement.noticeNumber'])
                    .innerJoin('infringement.issuer', 'issuer')
                    .addSelect(['issuer.name', 'issuer.issuerId'])
                    .andWhere(`( infringement.noticeNumber, issuer.name ) IN (${paramStrings.join(', ')})`, params);

                const foundInfringements = await query.getMany();
                found.push(...foundInfringements);
            }

            // for each not unique we need to remove it from the valid array and move it to the invalid array
            const foundIdentifiers = keyBy(found, (i) => `${i.noticeNumber}/${i.issuer.name}`);
            remove(results.valid, (item) => {
                const errors: ValidationError[] = [];
                if (foundIdentifiers[`${item.noticeNumber}/${item.issuer}`]) {
                    errors.push({
                        property: 'noticeNumber',
                        constraints: {
                            unique: `An infringement with this notice number already exists for the provided issuer`,
                        },
                        children: [],
                    });
                }
                if (!isEmpty(errors)) {
                    results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Add error
                    return true;
                }
                return false;
            });
        }
        this.logger.debugV2({ message: 'Database validity counts: ', detail: results.counts, context: this });
    }

    @LoggerMethod({ logData: false })
    async verify(dto: SpreadsheetUploadDto, file: MulterFile) {
        const spreadsheetData = await this.getSpreadsheetData(dto, file);

        this.logger.debugV2({ message: 'Verifying', detail: spreadsheetData.length, context: this });

        const results = await this.checkValidity(spreadsheetData);

        return SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );
    }

    @LoggerMethod({ logData: false })
    async upload(dto: SpreadsheetUploadDto, file: MulterFile, socket: DistributedWebsocket, timezone?: string) {
        // Use verification function so we only try create valid items
        const spreadsheetData = await this.getSpreadsheetData(dto, file);
        const verifyResults = await this.checkValidity(spreadsheetData, timezone);
        const results: UploadSpreadsheetResult<CreateInfringementSpreadsheetDto> = new UploadSpreadsheetResult<
            CreateInfringementSpreadsheetDto
        >();

        this.logger.logV2({ message: 'Uploading valid infringements', detail: verifyResults.valid.length, context: this });

        this.startNotify({ socket });
        const total = verifyResults.valid.length;
        /**
         * Using a mixture of observables and promises to achieve
         * concurrent creates
         */
        const jobs = from(verifyResults.valid).pipe(
            // For each valid result attempt to concurrently perform an action
            mergeMap((item) => {
                return from(this.createInfringementService.createInfringementFromSpreadsheet(item)).pipe(
                    // If the job fails push to invalid results
                    catchError((e) => {
                        this.logger.warnV2({
                            message: 'Failed to upload infringement',
                            detail: {
                                error: e.message,
                                stack: e.stack,
                            },
                            context: this,
                        });
                        results.invalid.push(this.createErrorItem(item, e));
                        this.progressNotify({ socket, counts: { ...results.counts, total } });

                        return EMPTY;
                    }),
                    // If no errors, push to valid results
                    tap((savedInfringement) => {
                        results.valid.push(item);
                        this.progressNotify({ socket, counts: { ...results.counts, total } });
                    }),
                );
                // Concurrency
            }, 1),
        );

        await jobs.toPromise();

        this.logger.logV2({ message: 'Uploaded infringements', detail: results.valid.length, context: this });
        const finalResult = SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );

        this.endNotify({ socket, result: finalResult });
    }

    async generateValidDocument(data: any): Promise<number> {
        return super.generateValidDocument(data, 'valid-infringements', 'infringement-uploads');
    }

    async generateInvalidDocument(data: any): Promise<number> {
        return super.generateInvalidDocument(data, 'invalid-infringements', 'infringement-uploads');
    }
}
