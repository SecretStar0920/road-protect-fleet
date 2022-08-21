import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { Integration } from '@entities';
import { RawContractOcrDto } from '@integrations/contract/raw-contract-ocr.dto';
import { contractOcrConfig } from '@config/contract-ocr';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';
import moment = require('moment');

@Injectable()
export class ContractOcrIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;

    async retrieveContractOCR(file: Partial<MulterFile>): Promise<RawContractOcrDto> {
        const url = contractOcrConfig.ocrEndpoint;
        this.logger.debug({ message: 'Contract OCR request', detail: { url }, fn: this.retrieveContractOCR.name });

        let response = null;
        const formData = {
            contract: {
                value: file.buffer,
                options: {
                    name: file.originalname,
                    contentType: null,
                },
            },
        };
        let form;
        try {
            form = jsonToFormData(formData);
        } catch (error) {
            this.logger.error({
                message: 'Contract OCR failed to attach document',
                detail: { url, error },
                fn: this.retrieveContractOCR.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.ContractOCR, url, error);
            return;
        }
        try {
            response = await httpClient
                .post(url, {
                    body: form,
                    headers: form.getHeaders(),
                    timeout: contractOcrConfig.defaultTimeout,
                })
                .then((d) => d.body);
        } catch (error) {
            this.logger.error({ message: 'Contract OCR request failed', detail: { url, error }, fn: this.retrieveContractOCR.name });
            await this.integrationRequestLogger.logFailed(Integration.ContractOCR, url, error);
            return;
        }

        if (response.error) {
            this.logger.error({
                message: 'Contract OCR request failed',
                detail: { url, error: response.error },
                fn: this.retrieveContractOCR.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.ContractOCR, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E025_ErrorFromContractOCR.message());
        }

        if (!response) {
            this.logger.error({ message: 'Contract OCR request returned null', detail: { url }, fn: this.retrieveContractOCR.name });
            await this.integrationRequestLogger.logFailed(
                Integration.ContractOCR,
                url,
                `Received unexpected null response from the Contract OCR`,
            );
            return;
        }

        try {
            response = plainToClass(RawContractOcrDto, JSON.parse(response) as object);
            this.logger.debug({ message: 'Contract OCR request finished', detail: { response }, fn: this.retrieveContractOCR.name });
            await this.integrationRequestLogger.logSuccessful(Integration.ContractOCR, url, response);
        } catch (e) {
            this.logger.error({ message: 'Contract OCR request failed', detail: { response }, fn: this.retrieveContractOCR.name });
            await this.integrationRequestLogger.logFailed(Integration.ContractOCR, url, response);
            return;
        }
        // Formatting dates correctly
        if (!!response.start) {
            response.start = moment(response.start).startOf('day').toISOString();
        }
        if (!!response.end) {
            response.end = moment(response.end).startOf('day').toISOString();
        }

        return response;
    }
}
