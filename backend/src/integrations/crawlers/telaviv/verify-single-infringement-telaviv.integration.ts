import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { TelavivRawInfringementDto } from '@integrations/crawlers/telaviv/telaviv-raw-infringement.dto';
import { Logger } from '@logger';
import { GeneralCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/general-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifySingleInfringementTelavivIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.telaviv.host + crawlers.telaviv.finesEndpoint;

    async retrieve(dto: GeneralCrawlerSingleInfringementRequestDto): Promise<TelavivRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'Telaviv crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient
                .get(url, {
                    timeout: Config.get.crawlerConfig.defaultTimeout,
                })
                .json();
        } catch (error) {
            this.logger.error({ message: 'Telaviv retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.TelavivVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Telaviv retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.TelavivVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Telaviv' }));
        }

        if (!response) {
            this.logger.error({ message: 'Telaviv retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.TelavivVerifyInfringement,
                url,
                `Received unexpected null response from Telaviv crawler`,
            );
            return [];
        }

        this.logger.debug({ message: 'Telaviv retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        await this.integrationRequestLogger.logSuccessful(Integration.TelavivVerifyInfringement, url, response);
        return response;
    }

    getBody(appData: GeneralCrawlerSingleInfringementRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(GeneralCrawlerSingleInfringementRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: GeneralCrawlerSingleInfringementRequestDto) {
        return this.retrieve(dto);
    }
}
