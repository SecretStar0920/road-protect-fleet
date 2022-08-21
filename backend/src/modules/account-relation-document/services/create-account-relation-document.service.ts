import { Injectable } from '@nestjs/common';
import { CreateAccountRelationDocumentDto } from '@modules/account-relation-document/controllers/account-relation-document.controller';
import { Logger } from '@logger';
import { AccountRelation, AccountRelationDocument, Document } from '@entities';
import { getManager } from 'typeorm';

@Injectable()
export class CreateAccountRelationDocumentService {
    constructor(private logger: Logger) {}

    async createAccountRelationDocument(dto: CreateAccountRelationDocumentDto): Promise<AccountRelationDocument> {
        this.logger.debug({ message: 'Creating AccountRelationDocument', detail: dto, fn: this.createAccountRelationDocument.name });
        const accountRelationDocument = await getManager().transaction(async (transaction) => {
            const created = await this.createOnly(dto);
            const saved = await transaction.save(created);
            return saved;
        });
        this.logger.debug({
            message: 'Saved AccountRelationDocument',
            detail: accountRelationDocument,
            fn: this.createAccountRelationDocument.name,
        });
        return accountRelationDocument;
    }

    async createOnly(dto: CreateAccountRelationDocumentDto): Promise<AccountRelationDocument> {
        const document = await Document.createQueryBuilder('document')
            .where('document.documentId = :documentId', { documentId: dto.documentId })
            .getOne();

        const relation = await AccountRelation.createQueryBuilder('relation')
            .where('accountRelation.accountRelationId = :relationId', { relationId: dto.accountRelationId })
            .getOne();

        return AccountRelationDocument.create({
            document,
            relation,
            type: dto.type,
        });
    }
}
