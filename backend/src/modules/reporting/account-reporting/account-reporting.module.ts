import { Module } from '@nestjs/common';
import { AccountVehicleReportingService } from './services/account-vehicle-reporting.service';
import { AccountReportingController } from './controllers/account-reporting.controller';
import { AccountInfringementReportingService } from '@modules/reporting/account-reporting/services/account-infringement-reporting.service';
import { AccountInfringementAmountReportingService } from '@modules/reporting/account-reporting/services/account-infringement-amount-reporting.service';
import { AccountLeadingVehiclesReportingService } from '@modules/reporting/account-reporting/services/account-leading-vehicles-reporting.service';
import { AccountSummaryReportingService } from '@modules/reporting/account-reporting/services/account-summary-reporting.service';

@Module({
    providers: [
        AccountVehicleReportingService,
        AccountInfringementReportingService,
        AccountInfringementAmountReportingService,
        AccountLeadingVehiclesReportingService,
        AccountSummaryReportingService,
    ],
    controllers: [AccountReportingController],
    exports: [
        AccountVehicleReportingService,
        AccountInfringementReportingService,
        AccountInfringementAmountReportingService,
        AccountLeadingVehiclesReportingService,
        AccountSummaryReportingService,
    ],
})
export class AccountReportingModule {}
