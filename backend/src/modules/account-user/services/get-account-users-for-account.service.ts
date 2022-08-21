import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { AccountUser } from '@entities';

@Injectable()
export class GetAccountUsersForAccountService {
    constructor(private logger: Logger) {}

    async getAccountUsersForAccount(accountId: number): Promise<AccountUser[]> {
        this.logger.log({ message: `Getting account users for account: `, detail: accountId, fn: this.getAccountUsersForAccount.name });
        const accountUsers = await AccountUser.findWithMinimalRelations()
            .andWhere('account.accountId = :accountId', { accountId })
            // .andWhere('accountUser.hidden = :hidden', { hidden: false })
            .getMany();

        this.logger.log({ message: `Found account users, length: `, detail: accountUsers.length, fn: this.getAccountUsersForAccount.name });
        return accountUsers;
    }
}
