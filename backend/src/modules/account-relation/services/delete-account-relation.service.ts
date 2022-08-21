import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountRelation } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteAccountRelationService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteAccountRelation(id: number): Promise<AccountRelation> {
        this.logger.log({ message: 'Deleting Account Relation:', detail: id, fn: this.deleteAccountRelation.name });
        const accountRelation = await AccountRelation.findOne(id);
        this.logger.log({ message: 'Found Account Relation:', detail: id, fn: this.deleteAccountRelation.name });
        if (!accountRelation) {
            this.logger.warn({ message: 'Could not find Account Relation to delete', detail: id, fn: this.deleteAccountRelation.name });
            throw new BadRequestException(ERROR_CODES.E006_CouldNotFindAccountRelationToDelete.message());
        }

        await AccountRelation.remove(accountRelation);
        this.logger.log({ message: 'Deleted Account Relation:', detail: id, fn: this.deleteAccountRelation.name });
        return AccountRelation.create({ accountRelationId: id });
    }

    async softDeleteAccountRelation(id: number): Promise<AccountRelation> {
        this.logger.log({ message: 'Soft Deleting Account Relation:', detail: id, fn: this.deleteAccountRelation.name });
        const accountRelation = await AccountRelation.findOne(id);
        this.logger.log({ message: 'Found Account Relation:', detail: id, fn: this.deleteAccountRelation.name });
        if (!accountRelation) {
            this.logger.warn({ message: 'Could not find Account Relation to delete', detail: id, fn: this.deleteAccountRelation.name });
            throw new BadRequestException(ERROR_CODES.E006_CouldNotFindAccountRelationToDelete.message());
        }

        // accountRelation.active = false; // FIXME
        await accountRelation.save();
        this.logger.log({ message: 'Soft Deleted Account Relation:', detail: id, fn: this.deleteAccountRelation.name });
        return accountRelation;
    }
}
