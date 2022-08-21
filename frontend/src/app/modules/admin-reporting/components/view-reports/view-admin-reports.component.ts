import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportingService } from '@modules/admin-reporting/services/reporting.service';
import { InfringementDueReportingComponent } from '@modules/admin-reporting/components/infringement-due-reporting/infringement-due-reporting.component';
import { InfringementStatusReportingComponent } from '@modules/admin-reporting/components/infringement-status-reporting/infringement-status-reporting.component';

@Component({
    selector: 'rp-view-admin-reports',
    templateUrl: './view-admin-reports.component.html',
    styleUrls: ['./view-admin-reports.component.less'],
})
export class ViewAdminReportsComponent implements OnInit {
    @ViewChild('infringementDue', { static: true }) infringementDue: InfringementDueReportingComponent;
    @ViewChild('infringementStatus', { static: true }) infringementStatus: InfringementStatusReportingComponent;

    constructor(private reportingService: ReportingService) {}

    ngOnInit() {}

    onRefresh() {
        this.reportingService.getIssuerInfringementsReportingData();
        this.reportingService.getSummaryReportingData();
        this.reportingService.getVehicleReportingData();
        this.infringementStatus.refresh();
        this.infringementDue.refresh();
    }
}
