import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Issuer } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetIssuerService {
    constructor(private logger: Logger) {}

    async getIssuer(issuerId: number): Promise<Issuer> {
        this.logger.log({ message: `Getting Issuer with id: `, detail: issuerId, fn: this.getIssuer.name });
        const issuer = await Issuer.findOne(issuerId);
        if (!issuer) {
            throw new BadRequestException({ message: ERROR_CODES.E132_IssuerNotFound.message({ issuerId }) });
        }
        this.logger.log({ message: `Found Issuer with id: `, detail: issuer.issuerId, fn: this.getIssuer.name });
        return issuer;
    }
}
