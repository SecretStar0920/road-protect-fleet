import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@modules/user/controllers/user.controller';
import { Logger } from '@logger';
import { Account, AccountUser, AccountUserRole, Log, LogPriority, LogType, Role, User, UserType } from '@entities';
import { Config } from '@config/config';
import { getManager } from 'typeorm';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { UserCreationEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { PasswordService } from '@modules/auth/services/password.service';

@Injectable()
export class CreateUserService {
    constructor(private logger: Logger, private emailService: EmailService, private passwordService: PasswordService) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        this.logger.debug({ message: 'Creating and saving user', detail: dto, fn: this.createUser.name });
        const password = await this.passwordService.generatePassword(dto.password);
        dto.password = password.raw; // @see this.create(dto) - the password gets hashed etc there
        const user = await getManager().transaction(async (transaction) => {
            const createdUser = await this.create(dto);
            return transaction.save(createdUser);
        });

        if (user.type === UserType.Admin || user.type === UserType.Developer) {
            await this.addSystemAdminToAllAccounts(user);
        }

        this.logger.debug({ message: 'Saved user', detail: user, fn: this.createUser.name });

        await this.sendNotification(user, password.raw);
        await Log.createAndSave({ user, type: LogType.Created, message: 'User', priority: LogPriority.High });

        return user;
    }

    async create(dto: CreateUserDto) {
        const password = await this.passwordService.generatePassword(dto.password);
        this.logger.debug({ message: 'Creating user', detail: dto, fn: this.create.name });

        const createdUser = await User.create(dto);
        createdUser.password = password.bcrypted;

        this.logger.debug({ message: 'Created user', detail: createdUser, fn: this.create.name });
        return createdUser;
    }

    /**
     * Super admins are automatically added to the account as 'hidden' users
     */
    private async addSystemAdminToAllAccounts(user: User): Promise<AccountUser[]> {
        this.logger.debug({ message: 'Adding admin to all accounts', detail: user.email, fn: this.addSystemAdminToAllAccounts.name });
        const accounts = await Account.find();
        const role = await Role.findOne({ name: 'System Administrator' });
        const accountUsers: AccountUser[] = accounts.map((account) => {
            return AccountUser.create({
                user,
                account,
                hidden: true,
                roles: [AccountUserRole.create({ role })],
            });
        });

        return await AccountUser.save(accountUsers);
    }

    public async sendNotification(user: User, rawPassword: string) {
        try {
            const context: UserCreationEmail = {
                name: user.firstName,
                link: Config.get.app.url + '/login',
                password: rawPassword,
                inviter: 'an Admin',
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.UserCreation,
                to: user.email,
                subject: 'Road Protect Invitation',
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
