import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '@entities';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteAccountService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteAccount(id: number): Promise<Account> {
        this.logger.log({ message: 'Deleting account:', detail: id, fn: this.deleteAccount.name });
        const account = await Account.findOne(id);
        this.logger.log({ message: 'Found account:', detail: id, fn: this.deleteAccount.name });
        if (!account) {
            this.logger.warn({ message: 'Could not find account to delete', detail: id, fn: this.deleteAccount.name });
            throw new BadRequestException({ message: ERROR_CODES.E034_CouldNotFindAccountToDelete.message() });
        }

        await Account.remove(account);
        this.logger.log({ message: 'Deleted account:', detail: id, fn: this.deleteAccount.name });
        return Account.create({ accountId: id });
    }

    async softDeleteAccount(id: number): Promise<Account> {
        this.logger.log({ message: 'Soft Deleting account:', detail: id, fn: this.deleteAccount.name });
        const account = await Account.findOne(id);
        this.logger.log({ message: 'Found account:', detail: id, fn: this.deleteAccount.name });
        if (!account) {
            this.logger.warn({ message: 'Could not find account to delete', detail: id, fn: this.deleteAccount.name });
            throw new BadRequestException({ message: ERROR_CODES.E034_CouldNotFindAccountToDelete.message() });
        }

        account.active = !account.active;
        await account.save();
        this.logger.log({ message: 'Soft Deleted account:', detail: id, fn: this.deleteAccount.name });
        return account;
    }
}
