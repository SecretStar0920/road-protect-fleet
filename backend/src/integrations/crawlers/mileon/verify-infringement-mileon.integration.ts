import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { MileonRawInfringementDto } from '@integrations/crawlers/mileon/mileon-raw-infringement.dto';
import { Logger } from '@logger';
import { MileonCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/mileon-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementMileonIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.mileon.host + crawlers.mileon.finesEndpoint;

    async retrieve(dto: MileonCrawlerSingleInfringementRequestDto): Promise<MileonRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'Mileon crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient
                .get(url, {
                    timeout: Config.get.crawlerConfig.defaultTimeout,
                })
                .json();
        } catch (error) {
            this.logger.error({ message: 'Mileon retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.MileonVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Mileon retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.MileonVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Mileon' }));
        }

        if (!response) {
            this.logger.error({ message: 'Mileon retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.MileonVerifyInfringement,
                url,
                `Received unexpected null response from Mileon crawler`,
            );
            return [];
        }

        this.logger.debug({ message: 'Mileon retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        await this.integrationRequestLogger.logSuccessful(Integration.MileonVerifyInfringement, url, response);
        return response;
    }

    getBody(appData: MileonCrawlerSingleInfringementRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(MileonCrawlerSingleInfringementRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: MileonCrawlerSingleInfringementRequestDto) {
        return this.retrieve(dto);
    }
}
