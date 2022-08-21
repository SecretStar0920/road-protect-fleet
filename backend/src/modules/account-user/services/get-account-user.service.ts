import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountUser } from '@entities';

@Injectable()
export class GetAccountUserService {
    constructor(private logger: Logger) {}

    async getCurrentAccountUser(accountUserId: number): Promise<AccountUser> {
        this.logger.log({ message: `Getting Account User`, detail: null, fn: this.getCurrentAccountUser.name });

        const accountUser = await AccountUser.findWithMinimalRelations()
            .andWhere('accountUser.accountUserId = :accountUserId', { accountUserId })
            .getOne();

        this.logger.log({ message: `Found Account User`, detail: accountUser.accountUserId, fn: this.getCurrentAccountUser.name });
        return accountUser;
    }
}
