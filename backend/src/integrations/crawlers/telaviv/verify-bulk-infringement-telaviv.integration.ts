import { Config } from '@config/config';
import { crawlers } from '@config/crawlers';
import { Integration } from '@entities';
import { TelavivRawInfringementDto } from '@integrations/crawlers/telaviv/telaviv-raw-infringement.dto';
import { Logger } from '@logger';
import { TelavivCrawlerMultipleInfringementRequestDto } from '@modules/crawlers/dtos/telaviv-crawler-request.dto';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { httpClient } from '@modules/shared/http-client/http-client';

export class TelavivBulkIntegrationResponse {
    toatal?: number;
    currenPage?: string;
    viewstate?: string;
    eventargument?: string;
    eventvalidation?: string;
    fines: TelavivRawInfringementDto[];
}

@Injectable()
export class VerifyBulkInfringementTelavivIntegration extends TestableIntegration {
    private logger = Logger.instance;
    private integrationRequestLogger = IntegrationRequestLogger.instance;
    private url = crawlers.telaviv.host + crawlers.telaviv.finesEndpoint;

    async retrieve(dto: TelavivCrawlerMultipleInfringementRequestDto): Promise<TelavivRawInfringementDto[]> {
        const results = [];
        let response = await this.getFirstPage(dto);

        // Spelling error 'toatal' from integration
        const total = response.toatal;
        this.logger.debug({
            message: `Expecting ${total} infringements from Telaviv`,
            fn: this.retrieve.name,
        });
        results.push(...response.fines);
        /** 
        while (results.length < total) {
            response = await this.getSubsequentPage(dto, response);
            results.push(...response.fines);
        }
        */
        return results;
    }

    private async getFirstPage(dto: TelavivCrawlerMultipleInfringementRequestDto): Promise<TelavivBulkIntegrationResponse> {
        dto.firstPage = true;
        const url = this.getUrl(dto);
        return await this.makeRequest(url, dto);
    }

    private async getSubsequentPage(
        dto: TelavivCrawlerMultipleInfringementRequestDto,
        previousResponse: TelavivBulkIntegrationResponse,
    ): Promise<TelavivBulkIntegrationResponse> {
        dto.firstPage = false;
        const url = this.url;
        const body = this.getBody(previousResponse);
        return await this.makeRequest(url, dto, body, true);
    }

    private async makeRequest(url: string, details: any = {}, body: any = {}, post: boolean = false) {
        this.logger.debug({
            message: 'Telaviv crawler retrieve bulk ticket request',
            detail: { url, body, details },
            fn: this.retrieve.name,
        });
        let response = null;
        try {
            if (post) {
                response = await httpClient
                    .post(url, {
                        json: body,
                        timeout: Config.get.crawlerConfig.telavivTimeout,
                    })
                    .json();
            } else {
                response = await httpClient
                    .get(url, {
                        timeout: Config.get.crawlerConfig.telavivTimeout,
                    })
                    .json();
            }
        } catch (error) {
            this.logger.error({
                message: 'Telaviv retrieve bulk ticket request failed',
                detail: { url, body, error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.TelavivVerifyInfringement, { url, body, details }, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Telaviv retrieve bulk ticket request failed',
                detail: { url, body, error: response.error },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.TelavivVerifyInfringement, { url, body, details }, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E022_ErrorFromCrawler.message({ crawler: 'Telaviv' }));
        }

        if (!response) {
            this.logger.error({
                message: 'Telaviv retrieve bulk ticket request returned null',
                detail: { url, body, details },
                fn: this.retrieve.name,
            });
            await this.integrationRequestLogger.logFailed(
                Integration.TelavivVerifyInfringement,
                { url, body, details },
                `Received unexpected null response from Telaviv crawler`,
            );
            return { fines: [] };
        }

        this.logger.debug({
            message: 'Telaviv retrieve bulk ticket request finished',
            detail: { url, body, details },
            fn: this.retrieve.name,
        });
        await this.integrationRequestLogger.logSuccessful(Integration.TelavivVerifyInfringement, { url, body, details }, response);
        return response;
    }

    private getUrl(appData: TelavivCrawlerMultipleInfringementRequestDto): string {
        const typed = plainToClass(TelavivCrawlerMultipleInfringementRequestDto, appData);
        return this.url + typed.queryString;
    }

    getBody(returnedResponse?: TelavivBulkIntegrationResponse): any {
        return {
            viewstate: returnedResponse?.viewstate,
            eventargument: returnedResponse?.eventargument,
            eventvalidation: returnedResponse?.eventvalidation,
        };
    }

    runTest(dto: TelavivCrawlerMultipleInfringementRequestDto) {
        return this.retrieve(dto);
    }
}
