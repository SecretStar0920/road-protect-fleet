import { BadRequestException, Injectable } from '@nestjs/common';
import { Account, ACCOUNT_USER_CONSTRAINTS, AccountUser, AccountUserRole, Role, User, UserType } from '@entities';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { Logger } from '@logger';
import { omit } from 'lodash';
import { CreateAccountUserDto } from '@modules/account-user/controllers/create-account-user.dto';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { Config } from '@config/config';
import { AccountInvitationEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { v4 } from 'uuid';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreateAccountUserService {
    constructor(private logger: Logger, private createUserService: CreateUserService, private emailService: EmailService) {}

    @Transactional()
    async createAccountUserAndCreateUserIfNotFound(dto: CreateAccountUserDto): Promise<AccountUser> {
        this.logger.log({ message: 'Creating account user', detail: dto, fn: this.createAccountUserAndCreateUserIfNotFound.name });
        let user = await User.findByEmail(dto.userEmail).getOne();
        const userFound = !!user;

        const account = await Account.findOneByIdOrNameOrIdentifier(dto.account);
        if (!account) {
            throw new BadRequestException({ message: ERROR_CODES.E026_CouldNotFindAccount.message() });
        }

        const roles: Role[] = [];
        if (!!dto.roleNames) {
            for (const roleName of dto.roleNames) {
                const role = await Role.findOne({ name: roleName });
                roles.push(role);
            }
        }

        if (roles.length < 1) {
            throw new BadRequestException({ message: ERROR_CODES.E027_NoRolesFound });
        }
        this.logger.log({
            message: 'Valid dto, creating account user',
            detail: dto,
            fn: this.createAccountUserAndCreateUserIfNotFound.name,
        });

        let accountUser: AccountUser;

        try {
            if (!userFound) {
                this.logger.log({
                    message: 'User not found, creating a new user',
                    detail: dto,
                    fn: this.createAccountUserAndCreateUserIfNotFound.name,
                });
                const tempPassword = v4(); // required for email here
                const createdUser = await this.createUserService.create({
                    name: dto.userName,
                    surname: dto.userSurname,
                    email: dto.userEmail,
                    type: UserType.Standard,
                    password: tempPassword,
                });
                user = await User.save(createdUser);
                this.createUserService.sendNotification(user, tempPassword).catch();
            }

            const accountUserRoles: AccountUserRole[] = roles.map((role) => {
                return AccountUserRole.create({ role });
            });

            const createdAccountUser = await this.createOneFromExisting(user, account, {
                roles: accountUserRoles,
            });

            accountUser = await AccountUser.save(createdAccountUser);
            await this.sendNotification(accountUser);
            this.logger.log({ message: 'Saved account user', detail: dto, fn: this.createAccountUserAndCreateUserIfNotFound.name });
            omit(accountUser, ['user.password']);
        } catch (e) {
            databaseExceptionHelper(e, ACCOUNT_USER_CONSTRAINTS, 'Failed to create account user, please contact the developers.');
        }

        return accountUser;
    }

    private async sendNotification(accountUser: AccountUser) {
        try {
            const context: AccountInvitationEmail = {
                name: accountUser.user.firstName,
                accountName: accountUser.account.name,
                roleName: accountUser.roles[0].role.name,
                link: Config.get.app.url,
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.AccountInvitation,
                to: accountUser.user.email,
                subject: 'Account Invitation',
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

    async createOneFromExisting(user: User, account: Account, additional?: Partial<AccountUser>): Promise<AccountUser> {
        return AccountUser.create({
            user,
            account,
            ...additional,
        });
    }

    /**
     * Creates many users for the same account with the same role
     */
    async createManyFromExisting(users: User[], account: Account, additional?: Partial<AccountUser>): Promise<AccountUser[]> {
        const accountUsers = [];
        for (const user of users) {
            accountUsers.push(await this.createOneFromExisting(user, account, additional));
        }
        return accountUsers;
    }
}
