import { MulterFile } from '@modules/shared/models/multer-file.model';
import { PartialInfringementDetailsDto } from '@modules/partial-infringement/dtos/partial-infringement-details.dto';
import { httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';
import { Config } from '@config/config';
import { IsString } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@logger';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { Integration } from '@entities';
import { Document } from '@entities';

export class OcrData {

    @IsString()
    issuer: string;

    @Expose()
    document: Buffer;
}

@Injectable()
export class OcrPartialInfringementService {

    private integrationName = Integration.PartialInfringementOCR;
    private integrationRequestLogger = IntegrationRequestLogger.instance;

    constructor(protected logger: Logger) {

    }

    private get serviceUrl(): string {
        return Config.get.infringementOcrParser.url
    }

    async processPartialInfringementFile(
        issuerName: string,
        documentsNumber: number,
        isCompleteList: Boolean,
        document: Document,
        file: MulterFile
    ): Promise<PartialInfringementDetailsDto[]> {
        const ocrData = new OcrData()
        ocrData.issuer = issuerName
        ocrData.document = file.buffer

        const form = jsonToFormData(ocrData);

        if (this.serviceUrl === undefined) {
            this.logger.debug({
                fn: this.processPartialInfringementFile.name,
                message: `Ocr service url is missing`,
            });

            await this.integrationRequestLogger.logFailed(
                this.integrationName,
                {issuer: issuerName},
                'Ocr service url is missing'
            );

            throw new InternalServerErrorException(ERROR_CODES.E170_PartialInfringementOCRServiceFailed)
        }

        let response;
        try {
            response = await httpClient.post(this.serviceUrl, {
                body: form,
                headers: form.getHeaders(),
            });

        } catch (e) {
            this.logger.debug({
                fn: this.processPartialInfringementFile.name,
                message: `Error requesting data from ucr service`,
                detail: e
            });

            await this.integrationRequestLogger.logFailed(
                this.integrationName,
                {issuer: issuerName},
                'Error requesting data from ucr service'
            );

            throw new InternalServerErrorException(ERROR_CODES.E170_PartialInfringementOCRServiceFailed)
        }

        try {
            let responseBody = JSON.parse(response.body);
            if (!Array.isArray(responseBody)) {
                responseBody = [responseBody]
            }

            const partialInfringementDetails = responseBody.map( (infringementData) => {
                return plainToClass(PartialInfringementDetailsDto, infringementData)
            })


            await this.integrationRequestLogger.logSuccessful(
                this.integrationName,
                {
                    issuer: issuerName
                },

                responseBody,
                {
                    issuerId: issuerName,
                    documentId: document.documentId,
                    infringementsCount: documentsNumber,
                    completeList: isCompleteList,
                    partialInfringements: responseBody
                }
            );

            return partialInfringementDetails
        } catch (e) {
            this.logger.debug({
                fn: this.processPartialInfringementFile.name,
                message: `Error processing ocr response`,
                detail: e
            });

            await this.integrationRequestLogger.logFailed(
                this.integrationName,
                {issuer: issuerName},
                'Error processing ocr response'
            );

            throw new InternalServerErrorException(ERROR_CODES.E170_PartialInfringementOCRServiceFailed)
        }
    }

}
