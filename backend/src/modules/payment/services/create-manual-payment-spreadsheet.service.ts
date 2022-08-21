import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, from } from 'rxjs';
import { isEmpty, merge } from 'lodash';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { plainToClass } from 'class-transformer';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { validate, ValidationError } from 'class-validator';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { validatorExceptionFactoryString } from '@modules/shared/helpers/validator-exception-factory.helper';
import { CreateManualPaymentService } from '@modules/payment/modules/manual-payment/services/create-manual-payment.service';
import { UploadManualProofOfPaymentDto } from '@modules/payment/controllers/payment-spreadsheet.controller';

import { MulterFile } from '@modules/shared/models/multer-file.model';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Injectable()
export class CreateManualPaymentSpreadsheetService extends SpreadsheetService<UploadManualProofOfPaymentDto> {
    constructor(
        protected logger: Logger,
        @Inject(forwardRef(() => CreateManualPaymentService))
        private createManualPaymentService: CreateManualPaymentService,
        protected createDataSpreadsheetService: XlsxService,
        protected createDocumentService: CreateDocumentService,
    ) {
        super(createDataSpreadsheetService, createDocumentService);
    }

    async checkValidity(spreadsheetData: any[]): Promise<UploadSpreadsheetResult<UploadManualProofOfPaymentDto>> {
        const results: UploadSpreadsheetResult<UploadManualProofOfPaymentDto> = new UploadSpreadsheetResult<
            UploadManualProofOfPaymentDto
        >();
        await this.checkDtoValid(spreadsheetData, results);
        await this.checkDatabaseValid(results);
        return results;
    }

    async checkDtoValid(data: any[], results: UploadSpreadsheetResult<UploadManualProofOfPaymentDto>): Promise<void> {
        this.logger.debug({ message: 'Checking Dto valid', detail: undefined, fn: this.checkDtoValid.name });
        // Check row by row
        for (const row of data) {
            const item = plainToClass(UploadManualProofOfPaymentDto, row);
            const errors: ValidationError[] = await validate(item);
            if (!isEmpty(errors)) {
                results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Store invalid
            } else {
                results.valid.push(item); // Store valid
            }
        }
        this.logger.debug({ message: 'Dto validity counts: ', detail: results.counts, fn: this.verify.name });
    }

    async checkDatabaseValid(results: UploadSpreadsheetResult<UploadManualProofOfPaymentDto>): Promise<void> {
        // Check database valid
        this.logger.debug({ message: 'Checking database valid', detail: undefined, fn: this.checkDatabaseValid.name });
        // Only check if there are valid results so far
        if (!isEmpty(results.valid)) {
            // // TODO: Build query
            // const params: any = {};
            // const paramStrings: string[] = [];
            // let uniqueCount = 0;
            // for (const item of results.valid) {
            // paramStrings.push(`(:noticeNumber${uniqueCount}, :issuerName${uniqueCount})`);
            // params[`noticeNumber${uniqueCount}`] = item.noticeNumber;
            // params[`issuerName${uniqueCount}`] = item.issuer;
            // uniqueCount++;
            // }
            // const query = Payment.createQueryBuilder('payment')
            // .select(['payment.noticeNumber'])
            // .innerJoin('payment.issuer', 'issuer')
            // .addSelect(['issuer.name', 'issuer.issuerId'])
            // .andWhere(`( payment.noticeNumber, issuer.name ) IN (${paramStrings.join(', ')})`, params);
            // const found: any[] = await query.getMany();
            // // for each not unique we need to remove it from the valid array and move it to the invalid array
            // const foundIdentifiers = keyBy(found, i => `${i.noticeNumber}/${i.issuer.name}`);
            // remove(results.valid, (item) => {
            // const errors: ValidationError[] = [];
            // if (foundIdentifiers[`${item.noticeNumber}/${item.issuer}`]) {
            // errors.push({
            // property: 'noticeNumber',
            // constraints: {
            // unique: `An payment with this notice number already exists for the provided issuer`
            // },
            // children: []
            // });
            // }
            // if (!isEmpty(errors)) {
            // results.invalid.push(merge(item, { error: validatorExceptionFactoryString(errors) })); // Add error
            // return true;
            // }
            // return false;
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

    async upload(dto: SpreadsheetUploadDto, file: MulterFile, socket: DistributedWebsocket) {
        // Use verification function so we only try create valid items
        const spreadsheetData = await this.getSpreadsheetData(dto, file);
        const verifyResults = await this.checkValidity(spreadsheetData);
        const results: UploadSpreadsheetResult<UploadManualProofOfPaymentDto> = new UploadSpreadsheetResult<
            UploadManualProofOfPaymentDto
        >();

        this.logger.log({ message: 'Uploading valid payments', detail: verifyResults.valid.length, fn: this.upload.name });

        const document = await this.createDocumentService.saveDocumentFileOcrAndCreate({
            fileName: file.originalname,
            fileDirectory: null
        }, file, false)


        this.startNotify({ socket });
        const total = verifyResults.valid.length;

        /**
         * Using a mixture of observables and promises to achieve
         * concurrent creates
         */
        const jobs = from(verifyResults.valid).pipe(
            // For each valid result attempt to concurrently perform an action
            mergeMap(
                (item) => {
                    return from(this.createManualPaymentService.createByUpload(item, document)).pipe(
                        // If the job fails push to invalid verifyResults
                        catchError((e) => {
                            this.logger.warn({
                                message: 'Failed to upload payment',
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
                        tap((savedPayment) => {
                            results.valid.push(item);
                            this.progressNotify({ socket, counts: { ...results.counts, total } });
                        }),
                    );
                    // Concurrency
                },
                null,
                5,
            ),
        );

        await jobs.toPromise();

        this.logger.log({ message: 'Uploaded payments', detail: results.valid.length, fn: this.upload.name });
        const finalResult = SpreadsheetUploadCompleteResponse.fromResults(
            results,
            await this.generateValidDocument(results.valid),
            await this.generateInvalidDocument(results.invalid),
        );

        this.endNotify({ socket, result: finalResult });
    }

    async generateValidDocument(data: any): Promise<number> {
        return super.generateValidDocument(data, 'valid-payments', 'payment-uploads');
    }

    async generateInvalidDocument(data: any): Promise<number> {
        return super.generateInvalidDocument(data, 'invalid-payments', 'payment-uploads');
    }
}
