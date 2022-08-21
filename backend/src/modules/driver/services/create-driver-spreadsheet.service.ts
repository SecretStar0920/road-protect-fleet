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
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { Config } from '@config/config';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { CreateDriverService } from '@modules/driver/services/create-driver.service';
import { CreateDriverSpreadsheetDto } from '@modules/driver/dtos/create-driver-spreadsheet.dto';

@Injectable()
export class CreateDriverSpreadsheetService extends SpreadsheetService<CreateDriverSpreadsheetDto> {
    constructor(
        protected logger: Logger,
        private createDriverService: CreateDriverService,
        protected createDataSpreadsheetService: XlsxService,
        protected createDocumentService: CreateDocumentService,
    ) {
        super(createDataSpreadsheetService, createDocumentService);
    }

    async checkValidity(spreadsheetData: any[], timezone?: string): Promise<UploadSpreadsheetResult<CreateDriverSpreadsheetDto>> {
        const results: UploadSpreadsheetResult<CreateDriverSpreadsheetDto> = new UploadSpreadsheetResult<CreateDriverSpreadsheetDto>();
        await this.checkDtoValid(spreadsheetData, results, timezone);
        await this.checkDatabaseValid(results);
        return results;
    }

    async checkDtoValid(data: any[], results: UploadSpreadsheetResult<CreateDriverSpreadsheetDto>, timezone?: string): Promise<void> {
        this.logger.debug({ message: 'Checking Dto valid', detail: data, fn: this.checkDtoValid.name });
        // Check row by row
        for (const row of data) {
            const item = plainToClass(CreateDriverSpreadsheetDto, {
                ...row,
                timezone: timezone || row.timezone || Config.get.app.timezone,
            });
            const errors: ValidationError[] = await validate(item);
            this.logger.debug({ message: 'Checking Dto valid', detail: errors, fn: this.checkDtoValid.name });
            if (!isEmpty(errors)) {
                results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Store invalid
            } else {
                results.valid.push(item); // Store valid
            }
        }
        this.logger.debug({ message: 'Dto validity counts: ', detail: results.counts, fn: this.verify.name });
    }

    async checkDatabaseValid(results: UploadSpreadsheetResult<CreateDriverSpreadsheetDto>): Promise<void> {
        // Check database valid
        this.logger.debug({ message: 'Checking database valid', detail: undefined, fn: this.checkDatabaseValid.name });
        // Only check if there are valid results so far
        if (!isEmpty(results.valid)) {
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
        const results: UploadSpreadsheetResult<CreateDriverSpreadsheetDto> = new UploadSpreadsheetResult<CreateDriverSpreadsheetDto>();

        this.logger.log({ message: 'Uploading valid drivers', detail: verifyResults.valid.length, fn: this.upload.name });

        this.startNotify({ socket });
        const total = verifyResults.valid.length;

        /**
         * Using a mixture of observables and promises to achieve
         * concurrent creates
         */
        const jobs = from(verifyResults.valid).pipe(
            // For each valid result attempt to concurrently perform an action
            mergeMap((item) => {
                return from(this.createDriverService.createSpreadsheetDriver(item)).pipe(
                    // If the job fails push to invalid verifyResults
                    catchError((e) => {
                        this.logger.warn({
                            message: 'Failed to upload driver',
                            detail: {
                                error: e.message,
                                stack: e.stack,
                            },
                            fn: this.upload.name,
                        });
                        results.invalid.push(this.createErrorItem(item, e));

                        // Socket progress for the invalid item
                        this.progressNotify({ socket, counts: { ...results.counts, total } });
                        return EMPTY;
                    }),
                    // If no errors, push to valid verifyResults
                    tap((savedDriver) => {
                        results.valid.push(item);

                        // Socket progress for the valid item
                        this.progressNotify({ socket, counts: { ...results.counts, total } });
                    }),
                );
                // Concurrency
            }, 1),
        );

        await jobs.toPromise();

        this.logger.log({ message: 'Uploaded driver', detail: results.valid.length, fn: this.upload.name });

        const finalResult = SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );

        this.endNotify({ socket, result: finalResult });
    }

    async generateValidDocument(data: any): Promise<number> {
        return super.generateValidDocument(data, 'valid-drivers', 'driver-uploads');
    }

    async generateInvalidDocument(data: any): Promise<number> {
        return super.generateInvalidDocument(data, 'invalid-drivers', 'driver-uploads');
    }
}
