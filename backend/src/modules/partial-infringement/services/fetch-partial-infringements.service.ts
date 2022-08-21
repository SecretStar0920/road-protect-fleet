import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Integration, PartialInfringement } from '@entities';
import { httpClient } from '@modules/shared/http-client/http-client';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { PartialInfringementDetailsDto } from '@modules/partial-infringement/dtos/partial-infringement-details.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { plainToClass } from 'class-transformer';
import { CreatePartialInfringementService } from '@modules/partial-infringement/services/create-partial-infringement.service';
import { Cron } from '@nestjs/schedule';

export class FetchPartialInfringementResponse {
    successful: PartialInfringementDetailsDto[];
    failed: { detail: PartialInfringementDetailsDto; error: any }[];
}

@Injectable()
export class FetchPartialInfringementsService {
    constructor(private logger: Logger, private createPartialInfringementService: CreatePartialInfringementService) {}
    private url = 'http://63.250.61.47:3000/infringement/partial';
    private integrationRequestLogger = IntegrationRequestLogger.instance;

    @Cron('0 * * * *') // every hour
    async fetchPartialInfringements(): Promise<FetchPartialInfringementResponse> {
        this.logger.debug({
            message: 'Fetching partial infringements',
            detail: { url: this.url },
            fn: this.fetchPartialInfringements.name,
        });

        const response: PartialInfringementDetailsDto[] = await this.fetchRawPartialInfringements();

        const successful: PartialInfringementDetailsDto[] = [];
        const failed: { detail: PartialInfringementDetailsDto; error: any }[] = [];
        for (const partialInfringement of response) {
            let created: PartialInfringement;
            try {
                created = await this.createPartialInfringementService.createPartialInfringement({ details: partialInfringement });
                successful.push(created);
            } catch (error) {
                this.logger.error({
                    message: 'Failed to create partial infringement',
                    detail: { details: partialInfringement, error },
                    fn: this.fetchPartialInfringements.name,
                });
                failed.push({ detail: partialInfringement, error });
            }
        }
        return { successful, failed };
    }

    private async fetchRawPartialInfringements(): Promise<PartialInfringementDetailsDto[]> {
        let response = null;
        try {
            response = await httpClient.get(this.url).json();
        } catch (error) {
            this.logger.error({
                message: 'Fetching partial infringements request failed',
                detail: { url: this.url, error },
                fn: this.fetchRawPartialInfringements.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.PartialInfringement, this.url, error);
            throw error;
        }

        if (response.error) {
            this.logger.error({
                message: 'Fetching partial infringements request failed',
                detail: { url: this.url, error: response.error },
                fn: this.fetchRawPartialInfringements.name,
            });
            await this.integrationRequestLogger.logFailed(Integration.PartialInfringement, this.url, response.error);
            throw new BadRequestException(response.error, ERROR_CODES.E168_FetchingPartialInfringementsFailed.message());
        }

        if (!response) {
            this.logger.error({
                message: 'Fetching partial infringements request returned null',
                detail: { url: this.url },
                fn: this.fetchRawPartialInfringements.name,
            });
            await this.integrationRequestLogger.logFailed(
                Integration.PartialInfringement,
                this.url,
                `Received unexpected null response from partial infringements request`,
            );
            return [];
        }

        this.logger.debug({
            message: 'Fetch partial infringements request finished',
            detail: { url: this.url, response },
            fn: this.fetchRawPartialInfringements.name,
        });
        response = response.map((partialInfringement) => {
            Object.keys(partialInfringement).forEach((key) => {
                if (partialInfringement[key] === '') {
                    delete partialInfringement[key];
                }
            });
            return plainToClass(PartialInfringementDetailsDto, partialInfringement);
        });
        await this.integrationRequestLogger.logSuccessful(Integration.PartialInfringement, this.url, response);
        return response;
    }
}
