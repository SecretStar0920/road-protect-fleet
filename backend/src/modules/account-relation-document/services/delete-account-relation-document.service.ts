import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountRelationDocument } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteAccountRelationDocumentService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteAccountRelationDocument(id: number): Promise<AccountRelationDocument> {
        this.logger.log({ message: 'Deleting Account Relation Document:', detail: id, fn: this.deleteAccountRelationDocument.name });
        const accountRelationDocument = await AccountRelationDocument.findOne(id);
        this.logger.log({ message: 'Found Account Relation Document:', detail: id, fn: this.deleteAccountRelationDocument.name });
        if (!accountRelationDocument) {
            this.logger.warn({
                message: 'Could not find Account Relation Document to delete',
                detail: id,
                fn: this.deleteAccountRelationDocument.name,
            });
            throw new BadRequestException(ERROR_CODES.E002_CouldNotFindAccountRelationDocumentToDelete.message());
        }

        await AccountRelationDocument.remove(accountRelationDocument);
        this.logger.log({ message: 'Deleted Account Relation Document:', detail: id, fn: this.deleteAccountRelationDocument.name });
        return AccountRelationDocument.create({ accountRelationDocumentId: id });
    }

    async softDeleteAccountRelationDocument(id: number): Promise<AccountRelationDocument> {
        this.logger.log({ message: 'Soft Deleting Account Relation Document:', detail: id, fn: this.deleteAccountRelationDocument.name });
        const accountRelationDocument = await AccountRelationDocument.findOne(id);
        this.logger.log({ message: 'Found Account Relation Document:', detail: id, fn: this.deleteAccountRelationDocument.name });
        if (!accountRelationDocument) {
            this.logger.warn({
                message: 'Could not find Account Relation Document to delete',
                detail: id,
                fn: this.deleteAccountRelationDocument.name,
            });
            throw new BadRequestException(ERROR_CODES.E002_CouldNotFindAccountRelationDocumentToDelete.message());
        }

        // accountRelationDocument.active = false; // FIXME
        await accountRelationDocument.save();
        this.logger.log({ message: 'Soft Deleted Account Relation Document:', detail: id, fn: this.deleteAccountRelationDocument.name });
        return accountRelationDocument;
    }
}
