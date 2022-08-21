import { Injectable, NotImplementedException } from '@nestjs/common';
import { Account, ACCOUNT_CONSTRAINTS, AccountUser, AccountUserRole, Log, LogPriority, LogType, Role, User } from '@entities';
import { Logger } from '@logger';
import { CreateAccountUserService } from '@modules/account-user/services/create-account-user.service';
import { CreateLocationService } from '@modules/location/services/create-location.service';
import { MetabaseEmbedService } from '@modules/metabase/services/metabase-embed.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateAccountSpreadsheetDto } from '@modules/account/controllers/create-account-spreadsheet.dto';
import { CreateAccountV2Dto } from '@modules/account/controllers/create-account-v2.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreateAccountV2Service {
    constructor(
        private logger: Logger,
        private createAccountUserService: CreateAccountUserService,
        private createLocationService: CreateLocationService,
        private metabaseEmbedService: MetabaseEmbedService,
    ) {}

    @Transactional()
    async createAccountFromSpreadsheet(dto: CreateAccountSpreadsheetDto): Promise<Account> {
        throw new NotImplementedException({ message: ERROR_CODES.E073_NotImplementedYetForCreateAccountV2.message() });
    }

    @Transactional()
    async createAccount(createAccountDto: CreateAccountV2Dto): Promise<Account> {
        this.logger.debug({ message: 'Creating account', detail: createAccountDto, fn: this.createAccount.name });
        // 1.Create the account
        let account: Account = await Account.create(createAccountDto);

        // 2. Also create the location
        if (createAccountDto.physicalLocation) {
            account.physicalLocation = await this.createLocationService.savePhysicalLocationV2(createAccountDto.physicalLocation);
        }
        if (createAccountDto.postalLocation) {
            account.postalLocation = await this.createLocationService.savePostalLocationV2(createAccountDto.postalLocation);
        }

        // 3. Save the account
        try {
            account = await Account.save(account);
            const initialAdminUsers = await this.addSystemAdmins(account);
            await AccountUser.save(initialAdminUsers);
        } catch (e) {
            databaseExceptionHelper(e, ACCOUNT_CONSTRAINTS, 'Failed to create account, please contact the developers.');
        }

        await this.metabaseEmbedService.updateAccountReportingEmbedUrl(account);
        await Log.createAndSave({ account, type: LogType.Created, message: 'Account', priority: LogPriority.High });
        this.logger.debug({ message: 'Created account', detail: account, fn: this.createAccount.name });

        return account;
    }

    /**
     * Super admins are automatically added to the account as 'hidden' users
     */
    @Transactional()
    private async addSystemAdmins(account: Account): Promise<AccountUser[]> {
        this.logger.debug({ message: 'Adding default system admins to account', detail: account.name, fn: this.addSystemAdmins.name });
        const admins = await User.getAdmins();
        this.logger.debug({ message: 'Admins: ', detail: admins.map((admin) => admin.email), fn: this.addSystemAdmins.name });
        const role = await Role.findOne({ name: 'System Administrator' });
        const accountUsers = await this.createAccountUserService.createManyFromExisting(admins, account, {
            hidden: true,
            roles: [AccountUserRole.create({ role })],
        });
        this.logger.debug({ message: 'Admin Users: ', detail: accountUsers.length, fn: this.addSystemAdmins.name });
        return accountUsers;
    }
}
