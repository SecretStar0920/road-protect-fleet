import { Crawler } from '@config/crawlers';
import { isProduction } from '@config/environment';
import { Integration } from '@entities';
import { Logger } from '@logger';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';
import { Injectable } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { v4 } from 'uuid';
import { omit } from 'lodash';
import { FormFileEntry, httpClient, jsonToFormData } from '@modules/shared/http-client/http-client';

export class RedirectionDetails {
    @ValidateNested()
    @Type(() => FormFileEntry)
    @Expose()
    redirectionDoc: FormFileEntry;
    @IsString()
    @IsOptional()
    userMail: string;
    @IsString()
    @IsOptional()
    userPhone: string;
    @IsString()
    reportNumber: string;
    @IsString()
    @IsOptional()
    ownerId: string;
    @IsString()
    @IsOptional()
    ownerName: string;
    @IsString()
    @IsOptional()
    custDrivingLicense?: string;
    @IsString()
    @IsOptional()
    driver?: string;
}


export class RedirectionData {
    @IsString()
    noticeNumber: string;
    @IsString()
    @IsOptional()
    requestingUserEmail: string;
    @IsString()
    @IsOptional()
    requestingUserPhone: string;
    @IsString()
    @IsOptional()
    ownerBrn: string;
    @IsString()
    @IsOptional()
    ownerName: string;
    @IsString()
    @IsOptional()
    custDrivingLicense?: string;
    @IsString()
    @IsOptional()
    driver?: string;

    @ValidateNested()
    @Type(() => FormFileEntry)
    @Expose()
    redirectionDocument: FormFileEntry;
}

class RedirectionResponse {
    confirmationNumber: string;
    message: string;
}

@Injectable()
export abstract class RedirectionIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private readonly url: string;
    private readonly integrationName: Integration;
    private readonly crawler: Crawler;

    protected constructor(integrationName: Integration, crawler: Crawler) {
        this.integrationName = integrationName;
        this.crawler = crawler;
        this.url = crawler.host + crawler.transferFineEndpoint;
    }

    async redirectInfringement(redirectionData: RedirectionData): Promise<RedirectionResponse> {
        const formData = this.getBody(redirectionData);
        const url = this.url;
        this.logger.debug({
            message: `Making Redirection Request to ${this.crawler.clientName}`,
            detail: {
                redirectionData: omitUnreadable(redirectionData),
                url,
                body: omitUnreadable(formData),
            },
            fn: this.redirectInfringement.name,
        });

        let response;
        try {
            // Fake redirection if not prod
            if (isProduction()) {
                this.logger.debug({
                    fn: this.redirectInfringement.name,
                    message: `Running a request in PRODUCTION name`,
                });
                const form = jsonToFormData(formData);
                this.logger.debug({
                    fn: this.redirectInfringement.name,
                    message: `Converted the form for the body`,
                });
                response = await httpClient.post(url, {
                    body: form,
                    headers: form.getHeaders(),
                });
            } else {
                this.logger.debug({
                    fn: this.redirectInfringement.name,
                    message: `Running a request in DEVELOPMENT name`,
                });
                const form = jsonToFormData(formData);
                this.logger.debug({
                    fn: this.redirectInfringement.name,
                    message: `Converted the form for the body`,
                    detail: { createdForm: !!form },
                });
                this.logger.debug({
                    fn: this.redirectInfringement.name,
                    message: '[TEST/STAGING RESULT] - skipped integration and generating dummy response',
                });
                const generatedConfirmationNumber = v4();
                response = { body: null };
                response.body =
                    Math.random() >= 0.5 ? ` { "fine_trx_id": "${generatedConfirmationNumber} הסבה" } ` : `{ "error": "failed" }`;
            }
        } catch (error) {
            await this.integrationRequestLogger.logFailed(this.integrationName, omit(formData, ['redirectionDoc']), error);
            throw new Error(`Redirection request failed from ${this.crawler.clientName}: ${error}`);
        }

        const responseBody = JSON.parse(response.body);
        this.logger.debug({
            message: `Received redirection response from ${this.crawler.clientName}`,
            detail: { response, responseBody },
            fn: this.redirectInfringement.name,
        });

        // This is logic to check we've received a successful response
        // The successful message is of the form { fine_trx_id: 'הסבה 2021-103218' }
        const expectedResponseString = 'הסבה';
        const fineTrxId = responseBody && responseBody.fine_trx_id ? `${responseBody.fine_trx_id as string}` : '';
        let [message, confirmationNumber] = fineTrxId.split(' ');

        message = message || '';
        confirmationNumber = confirmationNumber || '';

        if (message.indexOf(expectedResponseString) > -1 || confirmationNumber.indexOf(expectedResponseString) > -1) {
            await this.integrationRequestLogger.logSuccessful(this.integrationName, omit(formData, ['redirectionDoc']), response);
            return {
                confirmationNumber,
                message,
            };
        } else {
            await this.integrationRequestLogger.logFailed(this.integrationName, omit(formData, ['redirectionDoc']), response);
            throw new Error(`Redirection request failed from ${this.crawler.clientName}: ${message}`);
        }
    }

    abstract getBody(redirectionData: RedirectionData): RedirectionDetails;
}
