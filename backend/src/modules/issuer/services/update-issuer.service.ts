import { Injectable } from '@nestjs/common';
import { UpdateIssuerDto } from '@modules/issuer/controllers/issuer.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Issuer, ISSUER_CONSTRAINTS } from '@entities';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { IssuerIntegrationDetails, IssuerIntegrationType } from '@modules/shared/models/issuer-integration-details.model';
import { InfringementVerificationProvider } from '@config/infringement';

@Injectable()
export class UpdateIssuerService {
    constructor(private logger: Logger) {}

    async updateIssuer(id: number, dto: UpdateIssuerDto): Promise<Issuer> {
        this.logger.log({ message: 'Updating Issuer: ', detail: merge({ id }, dto), fn: this.updateIssuer.name });
        let issuer = await Issuer.findOne(id);

        if (typeof dto.integrationDetails === 'string') {
            const integrationDetails: IssuerIntegrationDetails = JSON.parse(dto.integrationDetails);
            dto.integrationDetails = integrationDetails;
        }
        const oldIntegrationDetailsCode = issuer.integrationDetails.code;
        const oldIntegrationDetailsType = issuer.integrationDetails.type;

        issuer = merge(issuer, dto);
        /*
         * if the external Code input and integration Details code are both changed, the prefered value will be integration Details code
         * if the provide input and integration Details type are both changed, the prefered value will be integration Details type
         */
        if (dto.externalCode !== issuer.integrationDetails.code) {
            issuer.integrationDetails.code = dto.externalCode;
        }
        if (dto.provider !== issuer.integrationDetails.type) {
            issuer.integrationDetails.type = IssuerIntegrationType[dto.provider];
            issuer.integrationDetails.verificationProvider = InfringementVerificationProvider[dto.provider];
        }
        if (dto.integrationDetails.code !== oldIntegrationDetailsCode) {
            issuer.integrationDetails.code = dto.integrationDetails.code;
        }
        if (dto.integrationDetails.type !== oldIntegrationDetailsType) {
            issuer.integrationDetails.type = IssuerIntegrationType[dto.integrationDetails.type];
            issuer.integrationDetails.verificationProvider = InfringementVerificationProvider[dto.integrationDetails.type];
        }
        try {
            await issuer.save();
        } catch (e) {
            databaseExceptionHelper(e, ISSUER_CONSTRAINTS, 'Failed to update issuer, please contact the developers.');
        }
        this.logger.log({ message: 'Updated Issuer: ', detail: id, fn: this.updateIssuer.name });
        return issuer;
    }
}
