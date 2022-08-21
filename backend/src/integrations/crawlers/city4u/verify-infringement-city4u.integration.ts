import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Logger } from '@logger';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { City4uSingleCrawlerRequestDto } from '@modules/crawlers/dtos/city4u-crawler-request.dto';
import { City4uRawInfringementDto } from '@integrations/crawlers/city4u/city4u-raw-infringement.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementCity4uIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.city4u.host + crawlers.city4u.finesEndpoint;

    async retrieve(dto: City4uSingleCrawlerRequestDto): Promise<City4uRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'City4u crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient
                .get(url, {
                    timeout: Config.get.crawlerConfig.defaultTimeout,
                    responseType: 'json',
                })
                .then((d) => d.body);
        } catch (error) {
            this.logger.error({ message: 'City4u retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.City4uVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'City4u retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.City4uVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'City4u' }));
        }

        if (!response) {
            this.logger.error({ message: 'City4u retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.City4uVerifyInfringement,
                url,
                `Received unexpected null response from City4u crawler`,
            );
            return;
        }

        this.logger.debug({ message: 'City4u retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        await this.integrationRequestLogger.logSuccessful(Integration.City4uVerifyInfringement, url, response);
        return response;
    }

    getBody(appData: City4uSingleCrawlerRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(City4uSingleCrawlerRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: City4uSingleCrawlerRequestDto) {
        return this.retrieve(dto);
    }
}
