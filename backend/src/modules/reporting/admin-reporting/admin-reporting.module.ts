import { Module } from '@nestjs/common';
import { AdminVehicleReportingService } from './services/admin-vehicle-reporting.service';
import { AdminReportingController } from './controllers/admin-reporting.controller';
import { AdminSummaryReportingService } from './services/admin-summary-reporting.service';
import { AdminInfringementStatusReportingService } from '@modules/reporting/admin-reporting/services/admin-infringement-status-reporting.service';
import { AdminIssuerInfringementsReportingService } from '@modules/reporting/admin-reporting/services/admin-issuer-infringement-reporting.service';
import { AdminInfringementsDueReportingService } from '@modules/reporting/admin-reporting/services/admin-infringement-due-reporting.service';

@Module({
    providers: [
        AdminVehicleReportingService,
        AdminSummaryReportingService,
        AdminInfringementStatusReportingService,
        AdminIssuerInfringementsReportingService,
        AdminInfringementsDueReportingService,
    ],
    controllers: [AdminReportingController],
})
export class AdminReportingModule {}
