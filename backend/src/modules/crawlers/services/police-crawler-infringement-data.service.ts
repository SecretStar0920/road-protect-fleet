import { Config } from '@config/config';
import { Crawler } from '@config/crawlers';
import { InfringementVerificationProvider } from '@config/infringement';
import { Client, Infringement, RawInfringement } from '@entities';
import { VerifyInfringementPoliceIntegration } from '@integrations/crawlers/police/verify-infringement-police.integration';
import { Logger } from '@logger';
import {
    PoliceCrawlerMultipleInfringementRequestDto,
    PoliceCrawlerSingleInfringementRequestDto,
} from '@modules/crawlers/dtos/police-crawler-request.dto';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import { isNil } from 'lodash';
import { PoliceRawInfringementDto } from '@integrations/crawlers/police/police-raw-infringement.dto';
import { type } from 'os';

export class PoliceCrawlerSyncDto {
    @IsString()
    caseNumber: string;

    @IsString()
    identifier: string;
}

@Injectable()
export class PoliceCrawlerInfringementDataService {
    private client: Client;
    private crawlerConfig: Crawler = plainToClass(Crawler, Config.get.crawlers.police);

    constructor(
        private logger: Logger,
        private policeVerificationIntegration: VerifyInfringementPoliceIntegration,
        private createRawInfringementService: CreateRawInfringementService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: this.crawlerConfig.clientName });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find police client', fn: this.constructor.name });
        }
    }

    async verifyInfringement(
        noticeNumber: string,
        infringementId?: number,
        currentBrn?: string,
    ): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        this.logger.log({
            message: `Verifying Police infringement`,
            detail: {
                noticeNumber,
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
            ownerName: infringement.contract?.owner?.name,
            ownerBrn: infringement.contract?.owner?.identifier,
            userName: (infringement.contract || ({} as any))?.user?.name,
            userBrn: (infringement.contract || ({} as any))?.user?.identifier,
            carNumber: infringement.vehicle?.registration,
            currentBrn,
        };
        const typedDto = plainToClass(PoliceCrawlerSingleInfringementRequestDto, dto);
        let response = await this.policeVerificationIntegration.retrieve(typedDto);

        // Expecting only a single infringement so extract first infringement
        if (response.length > 0) {
            response = this.appendAdditionalFields(response, noticeNumber, this.crawlerConfig.issuerCode);
            const updatedInfringement = response[0];
            const result = await this.createRawInfringementService.createRawInfringement(updatedInfringement, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }
    }

    // TODO: Correct this to work with scheduler
    async createSyncDto(identifier: string): Promise<PoliceCrawlerSyncDto> {
        const requiredInfringement = await Infringement.findWithMinimalRelations()
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Police,
            })
            .andWhere('infringement.brn = :identifier', {
                identifier,
            })
            .andWhere('infringement.caseNumber is not null')
            .orderBy('infringement.offenceDate', 'DESC')
            .take(1)
            .getOne();

        if (!requiredInfringement) {
            const message = `To sync new infringements with Police, we need to have one Police issued infringement with a case number`;
            this.logger.error({
                message,
                detail: {
                    identifier,
                },
                fn: this.syncMultipleInfringements.name,
            });
            throw new BadRequestException(message);
        }

        return {
            identifier,
            caseNumber: requiredInfringement.caseNumber,
        };
    }

    async syncMultipleInfringements(dto: PoliceCrawlerSyncDto): Promise<any> {
        this.logger.debug({
            message: 'Syncing multiple infringements for Police crawler',
            detail: dto,
            fn: this.syncMultipleInfringements.name,
        });

        const request = {
            idNumber: dto.identifier,
            reportNumber: dto.caseNumber,
        };
        const typedDto = plainToClass(PoliceCrawlerMultipleInfringementRequestDto, request);
        const response = await this.policeVerificationIntegration.retrieve(typedDto);
        this.logger.debug({
            message: 'Police crawler received response for sync',
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

    private appendAdditionalFields(response: PoliceRawInfringementDto[], noticeNumber: string, externalCode: string) {
        return response.map((rawInfringement) => ({
            ...rawInfringement,
            issuer_code: externalCode,
            fine_id: noticeNumber,
        }));
    }
}
