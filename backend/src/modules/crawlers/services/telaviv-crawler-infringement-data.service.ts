import { Config } from '@config/config';
import { Crawler } from '@config/crawlers';
import { InfringementVerificationProvider } from '@config/infringement';
import { Account, Client, Infringement, InfringementStatus, RawInfringement } from '@entities';
import { VerifyBulkInfringementTelavivIntegration } from '@integrations/crawlers/telaviv/verify-bulk-infringement-telaviv.integration';
import { VerifySingleInfringementTelavivIntegration } from '@integrations/crawlers/telaviv/verify-single-infringement-telaviv.integration';
import { Logger } from '@logger';
import { GeneralCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/general-crawler-request.dto';
import { TelavivCrawlerMultipleInfringementRequestDto } from '@modules/crawlers/dtos/telaviv-crawler-request.dto';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import { isNil } from 'lodash';
import { TelavivRawInfringementDto } from '@integrations/crawlers/telaviv/telaviv-raw-infringement.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class TelavivCrawlerSyncDto {
    @IsString()
    noticeNumber: string;

    @IsString()
    registration: string;

    @IsString()
    identifier: string;
}

@Injectable()
export class TelavivCrawlerInfringementDataService implements OnModuleInit {
    private client: Client;
    private crawlerConfig: Crawler = plainToClass(Crawler, Config.get.crawlers.telaviv);

    constructor(
        private logger: Logger,
        private telavivSingleVerificationIntegration: VerifySingleInfringementTelavivIntegration,
        private telavivBulkVerificationIntegration: VerifyBulkInfringementTelavivIntegration,
        private createRawInfringementService: CreateRawInfringementService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: this.crawlerConfig.clientName });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find telaviv client', fn: this.constructor.name });
        }
    }

    async verifyInfringement(
        noticeNumber: string,
        registration: string,
        infringementId?: number,
        currentBrn?: string,
    ): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        this.logger.log({
            message: `Verifying Telaviv infringement`,
            detail: {
                noticeNumber,
                registration,
                infringementId,
                currentBrn,
            },
            fn: this.verifyInfringement.name,
        });

        const infringement = infringementId
            ? await Infringement.findById(infringementId)
            : (await Infringement.findByNoticeNumber(noticeNumber)) || ({} as any);
        const dto = {
            reportNumber: noticeNumber,
            carNumber: registration,
            ownerName: infringement.contract?.owner?.name,
            ownerBrn: infringement.contract?.owner?.identifier,
            userName: (infringement.contract || ({} as any))?.user?.name,
            userBrn: (infringement.contract || ({} as any))?.user?.identifier,
            currentBrn,
        };
        const typedDto = plainToClass(GeneralCrawlerSingleInfringementRequestDto, dto);
        let response = await this.telavivSingleVerificationIntegration.retrieve(typedDto);

        // Expecting only a single infringement so extract first infringement
        if (response.length > 0) {
            response = this.appendAdditionalFields(response, noticeNumber, registration, this.crawlerConfig.issuerCode);
            const updatedInfringement = response[0];
            const result = await this.createRawInfringementService.createRawInfringement(updatedInfringement, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }
    }

    // TODO: Correct this to work with scheduler
    async createSyncDto(identifier: string): Promise<TelavivCrawlerSyncDto> {
        const account = await Account.findOneByIdOrNameOrIdentifier(identifier);

        if (!account) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountIdentifier: identifier }) });
        }

        const requiredInfringement = await Infringement.findWithMinimalRelations()
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Telaviv,
            })
            .andWhere('infringement.brn = :identifier', {
                identifier,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .orderBy('infringement.offenceDate', 'DESC')
            .take(1)
            .getOne();

        if (!requiredInfringement) {
            this.logger.error({
                message: ERROR_CODES.E048_CrawlerSyncRequiresInfringementIssuedForTheVehicle.message({ crawler: 'Telaviv' }),
                detail: {
                    identifier,
                },
                fn: this.syncMultipleInfringements.name,
            });
            throw new BadRequestException(
                ERROR_CODES.E048_CrawlerSyncRequiresInfringementIssuedForTheVehicle.message({ crawler: 'Telaviv' }),
            );
        }

        return {
            registration: requiredInfringement?.vehicle?.registration,
            noticeNumber: requiredInfringement?.noticeNumber,
            identifier,
        };
    }

    async syncMultipleInfringements(dto: TelavivCrawlerSyncDto): Promise<any> {
        this.logger.debug({
            message: 'Syncing multiple infringements for Telaviv crawler',
            detail: dto,
            fn: this.syncMultipleInfringements.name,
        });

        const request = {
            carNumber: dto.registration,
            idNumber: dto.identifier,
            reportNumber: dto.noticeNumber,
        };
        const typedDto = plainToClass(TelavivCrawlerMultipleInfringementRequestDto, request);

        const response = await this.telavivBulkVerificationIntegration.retrieve(typedDto);

        this.logger.debug({
            message: 'Telaviv crawler received response for sync',
            detail: { responseLength: response.length },
            fn: this.syncMultipleInfringements.name,
        });
        const result = [];
        for (const infringement of response) {
            infringement.issuer_code = this.crawlerConfig.issuerCode;
            const processed = await this.createRawInfringementService.createRawInfringement(infringement, this.client);
            result.push(processed);
        }
        return result;
    }

    private appendAdditionalFields(
        response: TelavivRawInfringementDto[],
        noticeNumber: string,
        registration: string,
        externalCode: string,
    ) {
        return response.map((rawInfringement) => ({
            ...rawInfringement,
            issuer_code: externalCode,
            fine_veh_id: registration,
            fine_id: noticeNumber,
        }));
    }
}
