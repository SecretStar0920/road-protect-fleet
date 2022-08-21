import { Module } from '@nestjs/common';
import { AccountUserController } from './controllers/account-user.controller';
import { CreateAccountUserService } from './services/create-account-user.service';
import { UpdateAccountUserService } from './services/update-account-user.service';
import { GetAccountUserService } from './services/get-account-user.service';
import { GetAccountUsersService } from './services/get-account-users.service';
import { DeleteAccountUserService } from './services/delete-account-user.service';
import { GetAccountUsersForAccountService } from '@modules/account-user/services/get-account-users-for-account.service';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { AccountUserQueryController } from '@modules/account-user/controllers/account-user-query.controller';

@Module({
    controllers: [AccountUserController, AccountUserQueryController],
    providers: [
        CreateAccountUserService,
        UpdateAccountUserService,
        GetAccountUserService,
        GetAccountUsersService,
        GetAccountUsersForAccountService,
        DeleteAccountUserService,
        CreateUserService,
    ],
    exports: [
        CreateAccountUserService,
        UpdateAccountUserService,
        GetAccountUserService,
        GetAccountUsersService,
        GetAccountUsersService,
        DeleteAccountUserService,
    ],
})
export class AccountUserModule {}
