import { Client, Infringement, RawInfringement } from '@entities';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { ATGTicketRequest } from '@integrations/automation/models/atg-ticket-details.model';
import { VerifyInfringementAutomationIntegration } from '@integrations/automation/verify-infringement.automation-integration';
import { Logger } from '@logger';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isNil } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class AtgInfringementDataService implements OnModuleInit {
    private client: Client;

    constructor(
        private logger: Logger,
        private atgIssuers: AtgIssuers,
        private atgVerificationIntegration: VerifyInfringementAutomationIntegration,
        private createRawInfringementService: CreateRawInfringementService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: 'atg-verification' });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find atg verification client', fn: this.constructor.name });
        }
    }

    async verifyInfringement(
        issuerCityCode: string,
        issuerCityName: string,
        noticeNumber: string,
        registration: string,
        currentBrn?: string,
    ): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        this.logger.log({
            message: `Verifying Atg infringement`,
            detail: {
                issuerCityCode,
                issuerCityName,
                noticeNumber,
                registration,
                currentBrn,
            },
            fn: this.verifyInfringement.name,
        });
        const dto = {
            customer: issuerCityCode,
            city: issuerCityName,
            ticketNumber: noticeNumber,
            carNumber: registration,
            currentBrn,
        };
        const typedDto = plainToClass(ATGTicketRequest, dto);
        const response = await this.atgVerificationIntegration.retrieve(typedDto);
        const ticketDetails = response.appDataResponse?.ticketDetails;
        if (ticketDetails) {
            const result = await this.createRawInfringementService.createRawInfringement(ticketDetails, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }

        throw new BadRequestException({
            message: ERROR_CODES.E143_InfringementNotFoundOnATG.message({ noticeNumber: typedDto.ticketNumber }),
        });
    }
}
