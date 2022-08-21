import { Issuer } from '@entities';
import { ExternalIssuerIntegrationDetails, IssuerIntegrationType } from '@modules/shared/models/issuer-integration-details.model';
import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class GetIssuerExternalCodeService {
    @Transactional()
    async getExternalCodeByIssuerId(issuerId: number): Promise<string> {
        const issuer = await Issuer.createQueryBuilder('issuer').andWhere('issuer.issuerId = :issuerId', { issuerId }).getOne();

        if (isNil(issuer) || isNil(issuer.integrationDetails)) {
            return null;
        }
        return (issuer.integrationDetails as ExternalIssuerIntegrationDetails).code;
    }

    @Transactional()
    async getIssuerByExternalCodeAndType(code: string, type: IssuerIntegrationType): Promise<Issuer> {
        return Issuer.createQueryBuilder('issuer')
            .andWhere(`"issuer"."integrationDetails"->>'type' = :type`, { type })
            .andWhere(`"issuer"."integrationDetails"->>'code' = :code`, { code })
            .getOne();
    }

    @Transactional()
    async getIssuerByIssuerId(issuerId: number): Promise<Issuer> {
        return Issuer.createQueryBuilder('issuer')
            .andWhere(`issuer.issuerId = :issuerId`, { issuerId })
            .getOne();
    }
}
