import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { PoliceRawInfringementDto } from '@integrations/crawlers/police/police-raw-infringement.dto';
import { Logger } from '@logger';
import { PoliceCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/police-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementPoliceIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.police.host + crawlers.police.finesEndpoint;

    async retrieve(dto: PoliceCrawlerSingleInfringementRequestDto): Promise<PoliceRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'Police crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient
                .get(url, {
                    timeout: Config.get.crawlerConfig.policeTimeout,
                })
                .json();
        } catch (error) {
            this.logger.error({ message: 'Police retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.PoliceVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Police retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.PoliceVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Police' }));
        }

        if (!response) {
            this.logger.error({ message: 'Police retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.PoliceVerifyInfringement,
                url,
                `Received unexpected null response from Police crawler`,
            );
            return [];
        }

        this.logger.debug({ message: 'Police retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        await this.integrationRequestLogger.logSuccessful(Integration.PoliceVerifyInfringement, url, response);
        return response;
    }

    getBody(appData: PoliceCrawlerSingleInfringementRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(PoliceCrawlerSingleInfringementRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: PoliceCrawlerSingleInfringementRequestDto) {
        return this.retrieve(dto);
    }
}
