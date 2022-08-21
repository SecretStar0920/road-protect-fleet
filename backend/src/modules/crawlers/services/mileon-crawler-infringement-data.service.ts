import { Config } from '@config/config';
import { Crawler } from '@config/crawlers';
import { InfringementVerificationProvider } from '@config/infringement';
import { Client, Infringement, InfringementStatus, Issuer, RawInfringement, Vehicle } from '@entities';
import { MileonRawInfringementDto } from '@integrations/crawlers/mileon/mileon-raw-infringement.dto';
import { VerifyInfringementMileonIntegration } from '@integrations/crawlers/mileon/verify-infringement-mileon.integration';
import { Logger } from '@logger';
import {
    MileonCrawlerMultipleInfringementRequestDto,
    MileonCrawlerSingleInfringementRequestDto,
} from '@modules/crawlers/dtos/mileon-crawler-request.dto';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import { isNil } from 'lodash';
import { Brackets } from 'typeorm';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class MileonCrawlerSyncDto {
    @IsString()
    noticeNumber: string;

    @IsString()
    registration: string;

    @IsString()
    externalCode: string;
}

@Injectable()
export class MileonCrawlerInfringementDataService implements OnModuleInit {
    private client: Client;
    private crawlerConfig: Crawler = plainToClass(Crawler, Config.get.crawlers.mileon);

    constructor(
        private logger: Logger,
        private mileonVerificationIntegration: VerifyInfringementMileonIntegration,
        private createRawInfringementService: CreateRawInfringementService,
        private getIssuerExternalCodeService: GetIssuerExternalCodeService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: this.crawlerConfig.clientName });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find mileon client', fn: this.constructor.name });
        }
    }

    async verifyInfringement(
        issuerId: number,
        noticeNumber: string,
        registration: string,
        infringementId?: number,
        currentBrn?: string,
    ): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        this.logger.log({
            message: `Verifying Mileon infringement`,
            detail: {
                issuerId,
                noticeNumber,
                registration,
                infringementId,
                currentBrn,
            },
            fn: this.verifyInfringement.name,
        });
        const externalCode = await this.getIssuerExternalCodeService.getExternalCodeByIssuerId(issuerId);
        if (!externalCode) {
            throw new BadRequestException(ERROR_CODES.E017_RequiredMileonCodeForIssuer.message({ issuerId }));
        }

        const infringement = infringementId
            ? await Infringement.findById(infringementId)
            : (await Infringement.findByNoticeNumber(noticeNumber)) || ({} as any);
        const dto = {
            reportNumber: noticeNumber,
            carNumber: registration,
            rashut: externalCode,
            ownerName: infringement.contract?.owner?.name,
            ownerBrn: infringement.contract?.owner?.identifier,
            userName: (infringement.contract || ({} as any))?.user?.name,
            userBrn: (infringement.contract || ({} as any))?.user?.identifier,
            currentBrn,
        };
        const typedDto = plainToClass(MileonCrawlerSingleInfringementRequestDto, dto);
        let response = await this.mileonVerificationIntegration.retrieve(typedDto);

        // Expecting only a single infringement so extract first infringement
        if (response.length > 0) {
            response = this.appendAdditionalFields(response, externalCode);
            const updatedInfringement = response[0];
            updatedInfringement.fine_id = noticeNumber;
            updatedInfringement.fine_veh_id = registration;
            const result = await this.createRawInfringementService.createRawInfringement(updatedInfringement, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }
    }

    // TODO: Correct this to work with scheduler
    async createSyncDto(registration: string, issuerIdentifier: string): Promise<MileonCrawlerSyncDto> {
        const vehicle = await Vehicle.findOneByRegistrationOrId(registration);

        if (!vehicle) {
            throw new BadRequestException({ message: ERROR_CODES.E049_CouldNotFindVehicle.message({ registration }) });
        }

        const issuer = await Issuer.findByNameOrCode(issuerIdentifier);
        const externalCode = await this.getIssuerExternalCodeService.getExternalCodeByIssuerId(issuer?.issuerId);
        if (!externalCode) {
            throw new BadRequestException({
                issuer,
                message: ERROR_CODES.E017_RequiredMileonCodeForIssuer.message({ issuerId: issuer?.issuerId }),
            });
        }

        const requiredInfringement = await Infringement.findWithMinimalRelations()
            .andWhere('vehicle.registration = :registration', { registration })
            .andWhere(`issuer."integrationDetails"->>'code' = :externalCode`, { externalCode })
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Mileon,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .orderBy('infringement.offenceDate', 'DESC')
            .take(1)
            .getOne();

        if (!requiredInfringement) {
            this.logger.error({
                message: ERROR_CODES.E048_CrawlerSyncRequiresInfringementIssuedForTheVehicle.message({ crawler: 'Mileon' }),
                detail: {
                    registration,
                    issuerIdentifier,
                },
                fn: this.syncMultipleInfringements.name,
            });
            throw new BadRequestException(
                ERROR_CODES.E048_CrawlerSyncRequiresInfringementIssuedForTheVehicle.message({ crawler: 'Mileon' }),
            );
        }

        return {
            registration: requiredInfringement?.vehicle?.registration,
            noticeNumber: requiredInfringement?.noticeNumber,
            externalCode,
        };
    }

    async syncMultipleInfringements(dto: MileonCrawlerSyncDto): Promise<any> {
        this.logger.debug({
            message: 'Syncing vehicle infringements for specific municipality with Mileon crawler',
            detail: dto,
            fn: this.syncMultipleInfringements.name,
        });

        const request = {
            carNumber: dto.registration,
            reportNumber: dto.noticeNumber,
            rashut: dto.externalCode,
        };
        const typedDto = plainToClass(MileonCrawlerMultipleInfringementRequestDto, request);

        let response = await this.mileonVerificationIntegration.retrieve(typedDto);
        response = this.appendAdditionalFields(response, dto.externalCode);

        this.logger.debug({
            message: 'Mileon crawler received response for sync',
            detail: { responseLength: response.length },
            fn: this.syncMultipleInfringements.name,
        });
        const result = [];
        for (const infringement of response) {
            const processed = await this.createRawInfringementService.createRawInfringement(infringement, this.client);
            result.push(processed);
        }
        return result;
    }

    private appendAdditionalFields(response: MileonRawInfringementDto[], externalCode: string) {
        // Manually append issuer code and registration back onto infringement
        return response.map((rawInfringement) => ({
            ...rawInfringement,
            issuer_code: externalCode,
        }));
    }
}
