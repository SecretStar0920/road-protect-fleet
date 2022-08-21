import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Issuer } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteIssuerService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteIssuer(id: number): Promise<Issuer> {
        this.logger.log({ message: 'Deleting Issuer:', detail: id, fn: this.deleteIssuer.name });
        const issuer = await Issuer.findOne(id);
        this.logger.log({ message: 'Found Issuer:', detail: id, fn: this.deleteIssuer.name });
        if (!issuer) {
            this.logger.warn({ message: 'Could not find Issuer to delete', detail: id, fn: this.deleteIssuer.name });
            throw new BadRequestException({ message: ERROR_CODES.E135_CouldNotFindIssuerToDelete.message() });
        }

        await Issuer.remove(issuer);
        this.logger.log({ message: 'Deleted Issuer:', detail: id, fn: this.deleteIssuer.name });
        return Issuer.create({ issuerId: id });
    }

    async softDeleteIssuer(id: number): Promise<Issuer> {
        this.logger.log({ message: 'Soft Deleting Issuer:', detail: id, fn: this.deleteIssuer.name });
        const issuer = await Issuer.findOne(id);
        this.logger.log({ message: 'Found Issuer:', detail: id, fn: this.deleteIssuer.name });
        if (!issuer) {
            this.logger.warn({ message: 'Could not find Issuer to delete', detail: id, fn: this.deleteIssuer.name });
            throw new BadRequestException({ message: ERROR_CODES.E135_CouldNotFindIssuerToDelete.message() });
        }

        issuer.active = false;
        await issuer.save();
        this.logger.log({ message: 'Soft Deleted Issuer:', detail: id, fn: this.deleteIssuer.name });
        return issuer;
    }
}
