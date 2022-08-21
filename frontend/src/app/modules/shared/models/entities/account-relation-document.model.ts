import { Type } from 'class-transformer';
import { Timestamped } from '@modules/shared/models/timestamped';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { Document } from '@modules/shared/models/entities/document.model';

export enum AccountRelationDocumentType {
    PA = 'Power of Attorney',
    Other = 'Other',
}

export class AccountRelationDocument extends Timestamped {
    accountRelationDocumentId: number;
    type: AccountRelationDocumentType;
    @Type(() => AccountRelation)
    relation: AccountRelation;

    @Type(() => Document)
    document: Document;
}
