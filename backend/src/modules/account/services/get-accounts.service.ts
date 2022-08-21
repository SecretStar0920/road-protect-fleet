import { Injectable } from '@nestjs/common';
import { Account } from '@entities';
import { Logger } from '@logger';

@Injectable()
export class GetAccountsService {
    constructor(private logger: Logger) {}

    async getAccounts(): Promise<Account[]> {
        this.logger.log({ message: `Getting accounts`, detail: null, fn: this.getAccounts.name });
        const accounts = await Account.find();
        this.logger.log({ message: `Found accounts, length: `, detail: accounts.length, fn: this.getAccounts.name });
        return accounts;
    }

    async getAccountDropdownData(): Promise<Account[]> {
        this.logger.log({ message: `Getting accounts for dropdown data`, detail: null, fn: this.getAccounts.name });
        const accounts = await Account.createQueryBuilder('account')
            .select(['account.accountId', 'account.name', 'account.identifier'])
            .orderBy('account.name')
            .getMany();
        this.logger.log({ message: `Found accounts, length: `, detail: accounts.length, fn: this.getAccounts.name });
        return accounts;
    }
}
