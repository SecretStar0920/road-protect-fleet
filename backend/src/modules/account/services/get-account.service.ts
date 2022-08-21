import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '@entities';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetAccountService {
    constructor(private logger: Logger) {}

    async getAccount(accountId: number, withPaymentData: boolean = false): Promise<Account> {
        this.logger.log({ message: `Getting account with id: `, detail: accountId, fn: this.getAccount.name });
        const query = Account.findWithMinimalRelations()
            .andWhere('account.accountId = :accountId', { accountId })
            // FIXME: remove from here and query as separate entity
            .leftJoinAndSelect('account.notifications', 'notifications')
            .leftJoinAndSelect('notifications.infringement', 'infringement')
            .addOrderBy('notifications', 'DESC');

        if (withPaymentData) {
            query.leftJoinAndSelect('account.atgCreditGuard', 'atgToken');
            query.leftJoinAndSelect('account.rpCreditGuard', 'rpToken');
        }

        const account = await query.getOne();
        if (!account) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message({ accountId }) });
        }
        this.logger.log({ message: `Found account with id: `, detail: account.accountId, fn: this.getAccount.name });
        return account;
    }

    async getAccountByIdentifier(identifier: string): Promise<Account> {
        this.logger.log({ message: `Getting account with identifier: `, detail: identifier, fn: this.getAccountByIdentifier.name });
        const account = await Account.findOneByIdOrNameOrIdentifier(identifier);

        if (!account) {
            this.logger.error({
                message: `Could not find account with identifier: `,
                detail: identifier,
                fn: this.getAccountByIdentifier.name,
            });
            return;
        }
        this.logger.log({ message: `Found account with identifier: `, detail: account.identifier, fn: this.getAccountByIdentifier.name });
        return account;
    }

    async getAccountsForUser(userId: number): Promise<Account[]> {
        this.logger.log({ message: `Getting accounts for user with id: `, detail: userId, fn: this.getAccount.name });

        const accounts = await Account.createQueryBuilder('account')
            .select(['account.accountId', 'account.name', 'account.identifier'])
            .leftJoin('account.users', 'accountUsers')
            .innerJoin('accountUsers.user', 'user', 'user.userId = :userId', { userId })
            .orderBy('account.name')
            .getMany();

        this.logger.log({
            message: `Found accounts for user with id: ${userId}, length: ${accounts.length}`,
            detail: null,
            fn: this.getAccount.name,
        });
        return accounts;
    }
}
