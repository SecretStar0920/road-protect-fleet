import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountRelationDocument } from '@entities';

@Injectable()
export class GetAccountRelationDocumentsService {
    constructor(private logger: Logger) {}

    async getAccountRelationDocuments(): Promise<AccountRelationDocument[]> {
        this.logger.log({ message: `Getting Account Relation Documents`, detail: null, fn: this.getAccountRelationDocuments.name });
        const accountRelationDocuments = await AccountRelationDocument.findWithMinimalRelations().getMany();
        this.logger.log({
            message: `Found Account Relation Documents, length: `,
            detail: accountRelationDocuments.length,
            fn: this.getAccountRelationDocuments.name,
        });
        return accountRelationDocuments;
    }

    async getAccountRelationDocumentsForRelation(accountRelationId: number): Promise<AccountRelationDocument[]> {
        this.logger.log({ message: `Getting Account Relation Documents`, detail: null, fn: this.getAccountRelationDocuments.name });
        const accountRelationDocuments = await AccountRelationDocument.findWithMinimalRelations()
            .where('accountRelation.accountRelationId = :accountRelationId', { accountRelationId })
            .getMany();
        this.logger.log({
            message: `Found Account Relation Documents, length: `,
            detail: accountRelationDocuments.length,
            fn: this.getAccountRelationDocuments.name,
        });
        return accountRelationDocuments;
    }
}
