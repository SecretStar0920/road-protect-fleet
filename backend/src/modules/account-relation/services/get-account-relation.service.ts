import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountRelation } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetAccountRelationService {
    constructor(private logger: Logger) {}

    async getAccountRelation(accountRelationId: number): Promise<AccountRelation> {
        this.logger.log({ message: `Getting AccountRelation with id: `, detail: accountRelationId, fn: this.getAccountRelation.name });
        const accountRelation = await AccountRelation.findWithMinimalRelations()
            .andWhere('accountRelation.accountRelationId = :id', { id: accountRelationId })
            .getOne();
        if (!accountRelation) {
            throw new BadRequestException(ERROR_CODES.E012_CouldNotFindAccountRelation.message({ accountRelationId }));
        }
        this.logger.log({
            message: `Found AccountRelation with id: `,
            detail: accountRelation.accountRelationId,
            fn: this.getAccountRelation.name,
        });
        return accountRelation;
    }
}
