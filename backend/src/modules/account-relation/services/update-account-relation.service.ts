import { Injectable } from '@nestjs/common';
import { UpdateAccountRelationDto } from '@modules/account-relation/controllers/account-relation.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { AccountRelation } from '@entities';

@Injectable()
export class UpdateAccountRelationService {
    constructor(private logger: Logger) {}

    async updateAccountRelation(id: number, dto: UpdateAccountRelationDto): Promise<AccountRelation> {
        this.logger.log({ message: 'Updating Account Relation: ', detail: merge({ id }, dto), fn: this.updateAccountRelation.name });
        let accountRelation = await AccountRelation.findOne(id);
        accountRelation = merge(accountRelation, dto);
        await accountRelation.save();
        this.logger.log({ message: 'Updated Account Relation: ', detail: id, fn: this.updateAccountRelation.name });
        return accountRelation;
    }
}
