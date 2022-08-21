import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { Logger } from '@logger';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ShoharSingleCrawlerRequestDto } from '@modules/crawlers/dtos/shohar-crawler-request.dto';
import { ShoharRawInfringementDto } from '@integrations/crawlers/shohar/shohar-raw-infringement.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementShoharIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.shohar.host + crawlers.shohar.finesEndpoint;

    async retrieve(dto: ShoharSingleCrawlerRequestDto): Promise<ShoharRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'Shohar crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient
                .get(url, {
                    timeout: Config.get.crawlerConfig.defaultTimeout,
                    responseType: 'json',
                })
                .then((d) => d.body);
        } catch (error) {
            this.logger.error({ message: 'Shohar retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.ShoharVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Shohar retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.ShoharVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Shohar' }));
        }

        if (!response) {
            this.logger.error({ message: 'Shohar retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.ShoharVerifyInfringement,
                url,
                `Received unexpected null response from Shohar crawler`,
            );
            return;
        }

        this.logger.debug({ message: 'Shohar retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        await this.integrationRequestLogger.logSuccessful(Integration.ShoharVerifyInfringement, url, response);
        return response;
    }

    getBody(appData: ShoharSingleCrawlerRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(ShoharSingleCrawlerRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: ShoharSingleCrawlerRequestDto) {
        return this.retrieve(dto);
    }
}
