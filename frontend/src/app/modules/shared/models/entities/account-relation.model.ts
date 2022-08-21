import { Account } from '@modules/shared/models/entities/account.model';
import { Type } from 'class-transformer';
import { Timestamped } from '@modules/shared/models/timestamped';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';

export class AccountRelationData {
    summary: string; // Short summary of the relation for the table
    customFields?: any; // Things like {internalReference: 12371}
}

export class AccountRelation extends Timestamped {
    accountRelationId: number;
    @Type(() => Account)
    forward: Account;
    @Type(() => Account)
    reverse: Account;
    @Type(() => AccountRelationData)
    data: AccountRelationData;

    @Type(() => AccountRelationDocument)
    documents: AccountRelationDocument[];
}
