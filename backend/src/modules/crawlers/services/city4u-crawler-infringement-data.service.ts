import { Config } from '@config/config';
import { Crawler } from '@config/crawlers';
import { Client, Infringement, RawInfringement } from '@entities';
import { Logger } from '@logger';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isNil, keys } from 'lodash';
import { VerifyInfringementCity4uIntegration } from '@integrations/crawlers/city4u/verify-infringement-city4u.integration';
import { City4uSingleCrawlerRequestDto } from '@modules/crawlers/dtos/city4u-crawler-request.dto';
import { City4uRawInfringementDto } from '@integrations/crawlers/city4u/city4u-raw-infringement.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class City4uCrawlerInfringementDataService implements OnModuleInit {
    private client: Client;
    private crawlerConfig: Crawler = plainToClass(Crawler, Config.get.crawlers.city4u);

    constructor(
        private logger: Logger,
        private city4uVerificationIntegration: VerifyInfringementCity4uIntegration,
        private createRawInfringementService: CreateRawInfringementService,
        private getIssuerExternalCodeService: GetIssuerExternalCodeService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: this.crawlerConfig.clientName });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find city4u client', fn: this.constructor.name });
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
            message: `Verifying City4u infringement`,
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
                message: ERROR_CODES.E161_RequiredCity4uCodeForIssuer.message({ issuerId }),
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
        const typedDto = plainToClass(City4uSingleCrawlerRequestDto, dto);

        let response = await this.city4uVerificationIntegration.retrieve(typedDto);

        // Expecting only a single infringement so extract first infringement
        if (response.length > 0) {
            if (keys(response[0]).length === 0) {
                throw new BadRequestException(
                    ERROR_CODES.E018_UnexpectedEmptyResponseFromCrawler.message({ noticeNumber, crawler: 'City4u' }),
                );
            }
            response = this.appendAdditionalFields(response, registration, externalCode);
            const updatedInfringement = response[0];
            const result = await this.createRawInfringementService.createRawInfringement(updatedInfringement, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }
    }

    private appendAdditionalFields(response: City4uRawInfringementDto[], registration: string, externalCode: string) {
        // Manually append issuer code and registration back onto infringement
        return response.map((rawInfringement) => ({ ...rawInfringement, issuer_code: externalCode, fine_veh_id: registration }));
    }
}
