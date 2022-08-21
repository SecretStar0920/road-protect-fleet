import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAccountUserDto } from '@modules/account-user/controllers/account-user.controller';
import { ACCOUNT_USER_CONSTRAINTS, AccountUser, AccountUserRole, Role } from '@entities';
import { Logger } from '@logger';
import { merge } from 'lodash';
import { getManager } from 'typeorm';
import { AccountUserRoleChangeEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class UpdateAccountUserService {
    constructor(private logger: Logger, private emailService: EmailService) {}

    async updateAccountUser(id: number, dto: UpdateAccountUserDto): Promise<AccountUser> {
        this.logger.log({ message: 'Updating account user: ', detail: merge({ id }, dto), fn: this.updateAccountUser.name });
        let accountUser = await AccountUser.findWithMinimalRelations().andWhere('accountUser.accountUserId = :id', { id }).getOne();

        if (!accountUser) {
            throw new BadRequestException({ message: ERROR_CODES.E029_AccountUserNotFound.message() });
        }

        const roles: Role[] = [];

        if (dto.roleNames) {
            for (const roleName of dto.roleNames) {
                const role = await Role.findOne({ name: roleName });
                if (!role) {
                    throw new BadRequestException({ message: ERROR_CODES.E031_CouldNotFindRole.message({ roleName }) });
                }
                roles.push(role);
            }
        }

        try {
            await getManager().transaction(async (transaction) => {
                if (roles.length > 0) {
                    await transaction.remove<AccountUserRole[]>(accountUser.roles);
                    accountUser.roles = [];
                    const accountUserRoles = [];
                    for (const role of roles) {
                        const accountUserRole = await transaction.save(AccountUserRole.create({ role, accountUser }));
                        accountUserRoles.push(accountUserRole);
                    }
                    accountUser.roles = accountUserRoles;
                }
                if (dto.name) {
                    accountUser.user.name = dto.name;
                }
                if (dto.email) {
                    accountUser.user.email = dto.email;
                }
                accountUser = await transaction.save(accountUser);
            });
        } catch (e) {
            databaseExceptionHelper(e, ACCOUNT_USER_CONSTRAINTS, 'Failed to update account user, please contact the developers.');
        }

        this.logger.log({ message: 'Updated account user: ', detail: id, fn: this.updateAccountUser.name });

        if (roles) {
            // this.sendNotification(accountUser);
        }

        return accountUser;
    }

    private async sendNotification(accountUser: AccountUser) {
        try {
            const context: AccountUserRoleChangeEmail = {
                name: accountUser.user.firstName,
                accountName: accountUser.account.name,
                roleName: accountUser.roles.map((role) => role.role.name).join(', '),
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.AccountUserRoleChange,
                to: accountUser.user.email,
                subject: 'Account Role Change',
                context: context,
            });
        } catch (e) {
            this.logger.error({
                message: 'Failed to send account user role change email',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.sendNotification.name,
            });
        }
    }
}
