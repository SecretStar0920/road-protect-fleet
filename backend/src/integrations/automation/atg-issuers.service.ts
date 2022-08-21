import { Injectable } from '@nestjs/common';
import { Issuer } from '@entities';
import { isNil } from 'lodash';
import { ATGIssuerIntegrationDetails } from '@modules/shared/models/issuer-integration-details.model';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class AtgIssuers {
    @Transactional()
    async isATGIssuer(issuerId: number): Promise<boolean> {
        const issuer = await Issuer.createQueryBuilder('issuer')
            .andWhere('issuer.issuerId = :issuerId', { issuerId })
            .andWhere(`"issuer"."integrationDetails"->>'type' = 'ATG'`)
            .getOne();

        return !!issuer;
    }

    /**
     * Assuming it is
     */
    @Transactional()
    async isPCICompliant(issuerId: number): Promise<boolean> {
        const issuer = await Issuer.createQueryBuilder('issuer')
            .andWhere(`"issuer"."integrationDetails"->>'type' = 'ATG'`)
            .andWhere(`"issuer"."integrationDetails"->>'isPCI' = '1'`)
            .andWhere('issuer.issuerId = :issuerId', { issuerId })
            .getOne();

        return !!issuer;
    }

    @Transactional()
    async getATGCodeByIssuerCode(code: string): Promise<string> {
        const issuer = await Issuer.createQueryBuilder('issuer')
            .andWhere(`"issuer"."integrationDetails"->>'type' = 'ATG'`)
            .andWhere('issuer.code = :code', { code })
            .getOne();

        if (isNil(issuer)) {
            return null;
        }
        return (issuer.integrationDetails as ATGIssuerIntegrationDetails).code;
    }

    @Transactional()
    async getIssuerCodeByATGCode(atgCode: string): Promise<string> {
        const issuer = await this.getIssuerByATGCode(atgCode);
        if (isNil(issuer)) {
            return null;
        }
        return issuer.code;
    }

    @Transactional()
    async getIssuerByATGCode(atgCode: string): Promise<Issuer> {
        const issuer = await Issuer.createQueryBuilder('issuer')
            .andWhere(`"issuer"."integrationDetails"->>'type' = 'ATG'`)
            .andWhere(`"issuer"."integrationDetails"->>'code' = :code`, { code: atgCode })
            .getOne();
        return issuer;
    }
}
