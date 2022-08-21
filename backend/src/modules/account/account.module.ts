import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { CreateAccountV1Service } from './services/create-account-v1.service';
import { UpdateAccountV1Service } from './services/update-account-v1.service';
import { GetAccountService } from './services/get-account.service';
import { GetAccountsService } from './services/get-accounts.service';
import { DeleteAccountService } from './services/delete-account.service';
import { AccountUserModule } from '../account-user/account-user.module';
import { AccountSpreadsheetService } from '@modules/account/services/account-spreadsheet.service';
import { AccountSpreadsheetController } from '@modules/account/controllers/account-spreadsheet.controller';
import { AccountQueryController } from '@modules/account/controllers/account-query.controller';
import { LocationModule } from '@modules/location/location.module';
import { MetabaseModule } from '@modules/metabase/metabase.module';
import { AccountActionGuard } from '@modules/account/guards/account-action.guard';
import { CreateAccountV2Service } from '@modules/account/services/create-account-v2.service';
import { UpdateAccountV2Service } from '@modules/account/services/update-account-v2.service';
import { AccountReportNotificationService } from '@modules/account/services/account-report-notification.service';
import { HomeReportingModule } from '@modules/reporting/home-reporting/home-reporting.module';
import { AppRoutesProviderService } from '@modules/shared/services/app-routes-provider.service';
import { AccountReportingScheduleService } from '@modules/account/services/account-reporting-schedule.service';

@Module({
    controllers: [AccountController, AccountSpreadsheetController, AccountQueryController],
    providers: [
        CreateAccountV1Service,
        CreateAccountV2Service,
        UpdateAccountV1Service,
        UpdateAccountV2Service,
        GetAccountService,
        GetAccountsService,
        DeleteAccountService,
        AccountSpreadsheetService,
        AccountActionGuard,
        AccountReportNotificationService,
        AppRoutesProviderService,
        AccountReportingScheduleService
    ],
    imports: [AccountUserModule, LocationModule, MetabaseModule, HomeReportingModule],
    exports: [CreateAccountV1Service, AccountReportingScheduleService, CreateAccountV2Service],
})
export class AccountModule {}
