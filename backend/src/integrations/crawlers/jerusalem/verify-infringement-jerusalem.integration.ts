import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { JerusalemRawInfringementDto } from '@integrations/crawlers/jerusalem/jerusalem-raw-infringement.dto';
import { Logger } from '@logger';
import { GeneralCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/general-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementJerusalemIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.jerusalem.host + crawlers.jerusalem.finesEndpoint;

    async retrieve(dto: GeneralCrawlerSingleInfringementRequestDto): Promise<JerusalemRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'Jerusalem crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient
                .get(url, {
                    timeout: Config.get.crawlerConfig.defaultTimeout,
                })
                .json();
        } catch (error) {
            this.logger.error({ message: 'Jerusalem retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.JerusalemVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Jerusalem retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.JerusalemVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Jerusalem' }));
        }

        if (!response) {
            this.logger.error({ message: 'Jerusalem retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.JerusalemVerifyInfringement,
                url,
                `Received unexpected null response from Jerusalem crawler`,
                );
            return [];
        }

        this.logger.debug({ message: 'Jerusalem retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        await this.integrationRequestLogger.logSuccessful(Integration.JerusalemVerifyInfringement, url, response);
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
