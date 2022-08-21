import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountUser } from '@entities';
import { Logger } from '@logger';
import { AccountRemovalEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteAccountUserService {
    constructor(private logger: Logger, private emailService: EmailService) {}

    async deleteAccountUser(id: number): Promise<AccountUser> {
        this.logger.log({ message: 'Deleting account user:', detail: id, fn: this.deleteAccountUser.name });
        const user = await AccountUser.findWithMinimalRelations().andWhere('accountUser.accountUserId = :id', { id }).getOne();
        this.logger.log({ message: 'Found account user:', detail: id, fn: this.deleteAccountUser.name });
        if (!user) {
            this.logger.warn({ message: 'Could not find account user to delete', detail: id, fn: this.deleteAccountUser.name });
            throw new BadRequestException({ message: ERROR_CODES.E028_CouldNotFindAccountUserToDelete.message() });
        }

        await AccountUser.getRepository().delete(id);
        this.logger.log({ message: 'Deleted account user:', detail: id, fn: this.deleteAccountUser.name });
        // this.sendNotification(user); // TODO: re-add
        return user;
    }

    async sendNotification(accountUser: AccountUser) {
        try {
            const context: AccountRemovalEmail = {
                name: accountUser.user.firstName,
                accountName: accountUser.account.name,
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.AccountUserRemoval,
                to: accountUser.user.email,
                subject: 'Removal from an account',
                context: context,
            });
        } catch (e) {
            this.logger.error({
                message: 'Failed to send account creation email',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.sendNotification.name,
            });
        }
    }
}
