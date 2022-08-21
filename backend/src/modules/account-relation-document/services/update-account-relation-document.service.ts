import { Injectable } from '@nestjs/common';
import { UpdateAccountRelationDocumentDto } from '@modules/account-relation-document/controllers/account-relation-document.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { AccountRelationDocument } from '@entities';

@Injectable()
export class UpdateAccountRelationDocumentService {
    constructor(private logger: Logger) {}

    async updateAccountRelationDocument(id: number, dto: UpdateAccountRelationDocumentDto): Promise<AccountRelationDocument> {
        this.logger.log({
            message: 'Updating Account Relation Document: ',
            detail: merge({ id }, dto),
            fn: this.updateAccountRelationDocument.name,
        });
        let accountRelationDocument = await AccountRelationDocument.findWithMinimalRelations()
            .where('relation_document.accountRelationDocumentId = :id', { id })
            .getOne();
        accountRelationDocument = merge(accountRelationDocument, dto);
        await accountRelationDocument.save();
        this.logger.log({ message: 'Updated Account Relation Document: ', detail: id, fn: this.updateAccountRelationDocument.name });
        return accountRelationDocument;
    }
}
