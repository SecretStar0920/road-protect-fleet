import { Config } from '@config/config';
import { Crawler } from '@config/crawlers';
import { Client, Infringement, RawInfringement } from '@entities';
import { KfarSabaRawInfringementDto } from '@integrations/crawlers/kfarSaba/kfarSaba-raw-infringement.dto';
import { VerifyInfringementKfarSabaIntegration } from '@integrations/crawlers/kfarSaba/verify-infringement-kfarSaba.integration';
import { Logger } from '@logger';
import { KfarSabaCrawlerSingleInfringementRequestDto } from '@modules/crawlers/dtos/kfarSaba-crawler-request.dto';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { CreateRawInfringementService } from '@modules/raw-infringement/services/create-raw-infringement.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isNil, keys } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class KfarSabaCrawlerInfringementDataService implements OnModuleInit {
    private client: Client;
    private crawlerConfig: Crawler = plainToClass(Crawler, Config.get.crawlers.kfarSaba);

    constructor(
        private logger: Logger,
        private kfarSabaVerificationIntegration: VerifyInfringementKfarSabaIntegration,
        private createRawInfringementService: CreateRawInfringementService,
        private getIssuerExternalCodeService: GetIssuerExternalCodeService,
    ) {}

    async onModuleInit() {
        this.client = await Client.findOne({ name: this.crawlerConfig.clientName });

        if (isNil(this.client)) {
            this.logger.error({ message: 'Could not find kfarSaba client', fn: this.constructor.name });
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
            message: `Verifying KfarSaba infringement`,
            detail: {
                issuerId,
                noticeNumber,
                registration,
                infringementId,
                currentBrn,
            },
            fn: this.verifyInfringement.name,
        });
        let externalCode ='';
        if(issuerId == 499)
        {
            externalCode='12';
        }
        else
        {
            externalCode = await this.getIssuerExternalCodeService.getExternalCodeByIssuerId(issuerId);
        }
        if (!externalCode) {
            throw new BadRequestException({
                message: ERROR_CODES.E119_RequiredKfarSabaCodeForIssuer.message({ issuerId }),
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
        const typedDto = plainToClass(KfarSabaCrawlerSingleInfringementRequestDto, dto);

        let response = await this.kfarSabaVerificationIntegration.retrieve(typedDto);

        // Expecting only a single infringement so extract first infringement
        if (response.length > 0) {
            if (keys(response[0]).length === 0) {
                throw new BadRequestException(
                    ERROR_CODES.E018_UnexpectedEmptyResponseFromCrawler.message({ noticeNumber, crawler: 'KfarSaba' }),
                );
            }
            response = this.appendAdditionalFields(response, registration, noticeNumber, externalCode, issuerId);
            const updatedInfringement = response[0];
            const result = await this.createRawInfringementService.createRawInfringement(updatedInfringement, this.client);
            return { raw: result.raw, infringement: result.infringement || undefined };
        }
    }

    private appendAdditionalFields(response: KfarSabaRawInfringementDto[], registration: string, noticeNumber: string, externalCode: string, issuerId: number) {
        // Manually append issuer code and registration back onto infringement
        return response.map((rawInfringement) => ({
            ...rawInfringement,
            issuer_code: externalCode,
            fine_veh_id: registration,
            fine_id: noticeNumber,
            issuer_id: issuerId,
        }));
    }
}
