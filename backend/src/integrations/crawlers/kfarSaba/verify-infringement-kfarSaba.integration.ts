import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { KfarSabaRawInfringementDto } from '@integrations/crawlers/kfarSaba/kfarSaba-raw-infringement.dto';
import { Logger } from '@logger';
import { KfarSabaCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/kfarSaba-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

@Injectable()
export class VerifyInfringementKfarSabaIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.kfarSaba.host + crawlers.kfarSaba.finesEndpoint;

    async retrieve(dto: KfarSabaCrawlerSingleInfringementRequestDto): Promise<KfarSabaRawInfringementDto[]> {
        const url = this.getBody(dto);
        this.logger.debug({ message: 'KfarSaba crawler retrieve ticket request', detail: { url }, fn: this.retrieve.name });
        let response = null;
        try {
            response = await httpClient.get(url, {
                timeout: Config.get.crawlerConfig.defaultTimeout,
            });
        } catch (error) {
            this.logger.error({ message: 'KfarSaba retrieve ticket request failed', detail: { url, error }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(Integration.KfarSabaVerifyInfringement, url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'KfarSaba retrieve ticket request failed',
                detail: { url, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.KfarSabaVerifyInfringement, url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'KfarSaba' }));
        }

        if (!response) {
            this.logger.error({ message: 'KfarSaba retrieve ticket request returned null', detail: { url }, fn: this.retrieve.name });
            await this.integrationRequestLogger.logFailed(
                Integration.KfarSabaVerifyInfringement,
                url,
                `Received unexpected null response from KfarSaba crawler`,
            );
            return;
        }

        this.logger.debug({ message: 'KfarSaba retrieve ticket request finished', detail: { url }, fn: this.retrieve.name });
        const parsedResponse = JSON.parse(response.body);
        await this.integrationRequestLogger.logSuccessful(Integration.KfarSabaVerifyInfringement, url, parsedResponse);
        return parsedResponse;
    }

    getBody(appData: KfarSabaCrawlerSingleInfringementRequestDto): string {
        if (appData.queryString) {
            return this.url + appData.queryString;
        }
        const typed = plainToClass(KfarSabaCrawlerSingleInfringementRequestDto, appData);
        return this.url + typed.queryString;
    }

    runTest(dto: KfarSabaCrawlerSingleInfringementRequestDto) {
        return this.retrieve(dto);
    }
}
