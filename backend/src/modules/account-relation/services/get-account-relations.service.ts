import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountRelation } from '@entities';

@Injectable()
export class GetAccountRelationsService {
    constructor(private logger: Logger) {}

    async getAccountRelations(): Promise<AccountRelation[]> {
        this.logger.log({ message: `Getting Account Relations`, detail: null, fn: this.getAccountRelations.name });
        const accountRelations = await AccountRelation.createQueryBuilder('accountRelation').getMany();
        this.logger.log({
            message: `Found Account Relations, length: `,
            detail: accountRelations.length,
            fn: this.getAccountRelations.name,
        });
        return accountRelations;
    }
}
