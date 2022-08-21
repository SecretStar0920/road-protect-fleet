import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { MultiSeries } from '@modules/shared/dtos/chart-data.model';
import { MicroserviceGuard } from '@modules/auth/guards/microservice.guard';
import { WeeklyAccountInfringementReportingService } from '@modules/reporting/weekly-report/services/weekly-account-infringement-reporting.service';
import { WeeklyAccountVehicleReportingService } from '@modules/reporting/weekly-report/services/weekly-account-vehicle-reporting.service';
import { WeeklyAccountInfringementAmountReportingService } from '@modules/reporting/weekly-report/services/weekly-account-infringement-amount-reporting.service';
import { WeeklyAccountLeadingVehiclesReportingService } from '@modules/reporting/weekly-report/services/weekly-account-leading-vehicles-reporting.service';
import { Config } from '@config/config';

@Controller('account/:accountId/weekly-reporting')
@UseGuards(new MicroserviceGuard(Config.get.siblings['document-renderer'].name))
export class WeeklyReportingController {
    constructor(
        private weeklyAccountVehicleReportingService: WeeklyAccountVehicleReportingService,
        private weeklyAccountInfringementReportingService: WeeklyAccountInfringementReportingService,
        private weeklyAccountInfringementAmountReportingService: WeeklyAccountInfringementAmountReportingService,
        private weeklyAccountLeadingVehiclesReportingService: WeeklyAccountLeadingVehiclesReportingService,
    ) {}

    @Post('vehicle')
    async getVehicleReportingData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.weeklyAccountVehicleReportingService.getVehicleData(accountId);
    }

    @Post('vehicle/leading')
    async getLeadingVehicleData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.weeklyAccountLeadingVehiclesReportingService.getLeadingVehicleData(accountId);
    }

    @Post('infringement')
    async getInfringementReportingData(@Param('accountId') accountId: number): Promise<ReportingDataDto<MultiSeries>> {
        return this.weeklyAccountInfringementReportingService.getInfringementData(accountId);
    }

    @Post('infringement/amount')
    async getInfringementAmountData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.weeklyAccountInfringementAmountReportingService.getInfringementAmountData(accountId);
    }
}
