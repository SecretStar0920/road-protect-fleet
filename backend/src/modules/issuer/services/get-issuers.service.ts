import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Issuer } from '@entities';
import { InfringementVerificationProvider } from '@config/infringement';

@Injectable()
export class GetIssuersService {
    constructor(private logger: Logger) {}

    async getIssuers(): Promise<Issuer[]> {
        this.logger.log({ message: `Getting Issuers`, detail: null, fn: this.getIssuers.name });
        const issuers = await Issuer.findWithMinimalRelations().getMany();
        this.logger.log({ message: `Found Issuers, length: `, detail: issuers.length, fn: this.getIssuers.name });
        return issuers;
    }

    async getPoliceIssuer(): Promise<Issuer> {
        this.logger.log({ message: `Getting Issuers`, detail: null, fn: this.getIssuers.name });
        const issuer = await Issuer.findWithMinimalRelations()
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Police,
            })
            .getOne();
        this.logger.log({ message: `Found Police issuer`, detail: { issuerId: issuer?.issuerId }, fn: this.getIssuers.name });
        return issuer;
    }
}
