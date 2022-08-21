import { Module } from '@nestjs/common';
import { WeeklyAccountVehicleReportingService } from './services/weekly-account-vehicle-reporting.service';
import { WeeklyReportingController } from './controllers/weekly-reporting.controller';
import { WeeklyAccountInfringementAmountReportingService } from '@modules/reporting/weekly-report/services/weekly-account-infringement-amount-reporting.service';
import { WeeklyAccountLeadingVehiclesReportingService } from '@modules/reporting/weekly-report/services/weekly-account-leading-vehicles-reporting.service';
import { WeeklyAccountInfringementReportingService } from '@modules/reporting/weekly-report/services/weekly-account-infringement-reporting.service';

@Module({
    providers: [
        WeeklyAccountVehicleReportingService,
        WeeklyAccountInfringementAmountReportingService,
        WeeklyAccountLeadingVehiclesReportingService,
        WeeklyAccountInfringementReportingService,
    ],
    controllers: [WeeklyReportingController],
})
export class WeeklyReportingModule {}
