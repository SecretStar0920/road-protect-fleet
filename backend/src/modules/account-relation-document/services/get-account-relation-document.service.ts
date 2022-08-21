import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountRelationDocument } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetAccountRelationDocumentService {
    constructor(private logger: Logger) {}

    async getAccountRelationDocument(accountRelationDocumentId: number): Promise<AccountRelationDocument> {
        this.logger.log({
            message: `Getting AccountRelationDocument with id: `,
            detail: accountRelationDocumentId,
            fn: this.getAccountRelationDocument.name,
        });
        const accountRelationDocument = await AccountRelationDocument.findWithMinimalRelations()
            .andWhere('accountRelationDocument.accountRelationDocumentId = :id', { id: accountRelationDocumentId })
            .getOne();
        if (!accountRelationDocument) {
            throw new BadRequestException(ERROR_CODES.E014_CouldNotFindAccountRelationDocument.message({ accountRelationDocumentId }));
        }
        this.logger.log({
            message: `Found AccountRelationDocument with id: `,
            detail: accountRelationDocument.accountRelationDocumentId,
            fn: this.getAccountRelationDocument.name,
        });
        return accountRelationDocument;
    }
}
