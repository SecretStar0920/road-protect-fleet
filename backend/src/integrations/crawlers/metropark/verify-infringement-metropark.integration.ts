import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { MetroparkRawInfringementDto } from '@integrations/crawlers/metropark/metropark-raw-infringement.dto';
import { Logger } from '@logger';
import { MetroparkCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/metropark-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementMetroparkIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.metropark.host + crawlers.metropark.finesEndpoint;

    async retrieve(dto: MetroparkCrawlerSingleInfringementRequestDto): Promise<MetroparkRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'Metropark crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient.get(url, {
                timeout: Config.get.crawlerConfig.defaultTimeout,
            });
        } catch (error) {
            this.logger.error({ message: 'Metropark retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.MetroparkVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Metropark retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.MetroparkVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Metropark' }));
        }

        if (!response) {
            this.logger.error({ message: 'Metropark retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.MetroparkVerifyInfringement,
                url,
                `Received unexpected null response from Metropark crawler`,
            );
            return;
        }

        this.logger.debug({ message: 'Metropark retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        const parsedResponse = JSON.parse(response.body);
        await this.integrationRequestLogger.logSuccessful(Integration.MetroparkVerifyInfringement, url, parsedResponse);
        return parsedResponse;
    }

    getBody(appData: MetroparkCrawlerSingleInfringementRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(MetroparkCrawlerSingleInfringementRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: MetroparkCrawlerSingleInfringementRequestDto) {
        return this.retrieve(dto);
    }
}
