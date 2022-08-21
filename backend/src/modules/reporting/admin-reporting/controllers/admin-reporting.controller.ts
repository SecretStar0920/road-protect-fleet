import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MultiSeries } from '@modules/shared/dtos/chart-data.model';
import { AdminSummaryReportingService } from '@modules/reporting/admin-reporting/services/admin-summary-reporting.service';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { AdminVehicleReportingService } from '@modules/reporting/admin-reporting/services/admin-vehicle-reporting.service';
import { AdminInfringementStatusReportingService } from '@modules/reporting/admin-reporting/services/admin-infringement-status-reporting.service';
import { InfringementCalendarQueryDto } from '@modules/reporting/admin-reporting/controllers/infringement-calendar-query.dto';
import { InfringementStatusReportingDto } from '@modules/reporting/admin-reporting/controllers/infringement-status-reporting.dto';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { AdminIssuerInfringementsReportingService } from '@modules/reporting/admin-reporting/services/admin-issuer-infringement-reporting.service';
import { AdminInfringementsDueReportingService } from '@modules/reporting/admin-reporting/services/admin-infringement-due-reporting.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@Controller('reporting')
@UseGuards(UserAuthGuard, SystemAdminGuard)
export class AdminReportingController {
    constructor(
        private summaryReportingService: AdminSummaryReportingService,
        private vehicleReportingService: AdminVehicleReportingService,
        private infringementStatusReportingService: AdminInfringementStatusReportingService,
        private issuerInfringementsReportingService: AdminIssuerInfringementsReportingService,
        private infringementsDueReportingService: AdminInfringementsDueReportingService,
    ) {}

    @Post('summary')
    async getSummaryReportingData(): Promise<ReportingDataDto> {
        return this.summaryReportingService.getSummaryData();
    }

    @Post('vehicle')
    async getVehicleReportingData(): Promise<ReportingDataDto> {
        return this.vehicleReportingService.getVehicleData();
    }

    @Post('infringement/calendar')
    async getInfringementCalendarReportingData(@Body() dto: InfringementCalendarQueryDto): Promise<ReportingDataDto<MultiSeries>> {
        return this.infringementsDueReportingService.getInfringementsDueData(dto);
    }

    @Post('infringement/status')
    async getInfringementStatusReportingData(@Body() dto: InfringementStatusReportingDto): Promise<ReportingDataDto> {
        return this.infringementStatusReportingService.getInfringementStatusData(dto);
    }

    @Post('issuer/infringement')
    async getIssuerInfringementReportingData(): Promise<ReportingDataDto<MultiSeries>> {
        return this.issuerInfringementsReportingService.getIssuerInfringementsData();
    }
}
