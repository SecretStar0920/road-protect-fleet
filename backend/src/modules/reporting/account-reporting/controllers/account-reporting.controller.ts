import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { AccountVehicleReportingService } from '@modules/reporting/account-reporting/services/account-vehicle-reporting.service';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { AccountInfringementReportingService } from '@modules/reporting/account-reporting/services/account-infringement-reporting.service';
import { MultiSeries } from '@modules/shared/dtos/chart-data.model';
import { AccountInfringementAmountReportingService } from '@modules/reporting/account-reporting/services/account-infringement-amount-reporting.service';
import { AccountLeadingVehiclesReportingService } from '@modules/reporting/account-reporting/services/account-leading-vehicles-reporting.service';
import { AccountSummaryReportingService } from '@modules/reporting/account-reporting/services/account-summary-reporting.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@Controller('account/:accountId/reporting')
@UseGuards(UserAuthGuard, PermissionGuard)
export class AccountReportingController {
    constructor(
        private accountVehicleReportingService: AccountVehicleReportingService,
        private accountInfringementReportingService: AccountInfringementReportingService,
        private accountInfringementAmountReportingService: AccountInfringementAmountReportingService,
        private accountLeadingVehiclesReportingService: AccountLeadingVehiclesReportingService,
        private accountSummaryReportingService: AccountSummaryReportingService,
    ) {}

    @Post('summary')
    async getSummaryReportingData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.accountSummaryReportingService.getSummaryData(accountId);
    }

    @Post('vehicle')
    @Permissions(PERMISSIONS.VehicleReporting)
    async getVehicleReportingData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.accountVehicleReportingService.getVehicleData(accountId);
    }

    @Post('vehicle/leading')
    @Permissions(PERMISSIONS.VehicleReporting)
    async getLeadingVehicleData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.accountLeadingVehiclesReportingService.getLeadingVehicleData(accountId);
    }

    @Post('infringement')
    @Permissions(PERMISSIONS.InfringementReporting)
    async getInfringementReportingData(@Param('accountId') accountId: number): Promise<ReportingDataDto<MultiSeries>> {
        return this.accountInfringementReportingService.getInfringementData(accountId);
    }

    @Post('infringement/amount')
    @Permissions(PERMISSIONS.InfringementReporting)
    async getInfringementAmountData(@Param('accountId') accountId: number): Promise<ReportingDataDto> {
        return this.accountInfringementAmountReportingService.getInfringementAmountData(accountId);
    }
}
