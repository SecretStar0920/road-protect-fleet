import { Config } from '@config/config';
import { Crawler } from '@config/crawlers';
import { Client, Infringement, RawInfringement } from '@entities';
import { Logger } from '@logger';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isNil, keys } from 'lodash';
import { VerifyInfringementShoharIntegration } from '@integrations/crawlers/shohar/verify-infringement-shohar.integration';
import { ShoharSingleCrawlerRequestDto } from '@modules/crawlers/dtos/shohar-crawler-request.dto';
import { ShoharRawInfringementDto } from '@integrations/crawlers/shohar/shohar-raw-infringement.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class ShoharCrawlerInfringementDataService implements OnModuleInit {
    private client: Client;
    private crawlerConfig: Crawler = plainToClass(Crawler, Config.get.crawlers.shohar);

    constructor(
        private logger: Logger,
        private shoharVerificationIntegration: VerifyInfringementShoharIntegration,
        private createRawInfringementService: CreateRawInfringementService,
        private getIssuerExternalCodeService: GetIssuerExternalCodeService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: this.crawlerConfig.clientName });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find shohar client', fn: this.constructor.name });
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
            message: `Verifying Shohar infringement`,
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
            throw new BadRequestException({
                message: ERROR_CODES.E161_RequiredShoharCodeForIssuer.message({ issuerId }),
            });
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
        const typedDto = plainToClass(ShoharSingleCrawlerRequestDto, dto);

        let response = await this.shoharVerificationIntegration.retrieve(typedDto);

        // Expecting only a single infringement so extract first infringement
        if (response.length > 0) {
            if (keys(response[0]).length === 0) {
                throw new BadRequestException(
                    ERROR_CODES.E018_UnexpectedEmptyResponseFromCrawler.message({ noticeNumber, crawler: 'Shohar' }),
                );
            }
            response = this.appendAdditionalFields(response, registration, externalCode);
            const updatedInfringement = response[0];
            const result = await this.createRawInfringementService.createRawInfringement(updatedInfringement, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }
    }

    private appendAdditionalFields(response: ShoharRawInfringementDto[], registration: string, externalCode: string) {
        // Manually append issuer code and registration back onto infringement
        return response.map((rawInfringement) => ({ ...rawInfringement, issuer_code: externalCode, fine_veh_id: registration }));
    }
}
