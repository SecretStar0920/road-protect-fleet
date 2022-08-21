import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromReporting from './ngrx/reporting.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ReportingEffects } from './ngrx/reporting.effects';
import { SharedModule } from '@modules/shared/shared.module';
import { VehicleReportingComponent } from './components/vehicle-reporting/vehicle-reporting.component';
import { ViewAdminReportsComponent } from '@modules/admin-reporting/components/view-reports/view-admin-reports.component';
import { SummaryReportingComponent } from '@modules/admin-reporting/components/summary-reporting/summary-reporting.component';
import { InfringementDueReportingComponent } from '@modules/admin-reporting/components/infringement-due-reporting/infringement-due-reporting.component';
import { InfringementStatusReportingComponent } from '@modules/admin-reporting/components/infringement-status-reporting/infringement-status-reporting.component';
import { IssuerInfringementReportingComponent } from './components/issuer-infringement-reporting/issuer-infringement-reporting.component';
import { AdminReportsPageComponent } from './components/admin-reports-page/admin-reports-page.component';
import { SpreadsheetModule } from '@modules/shared/modules/spreadsheet/spreadsheet.module';

@NgModule({
    declarations: [
        ViewAdminReportsComponent,
        VehicleReportingComponent,
        SummaryReportingComponent,
        InfringementDueReportingComponent,
        InfringementStatusReportingComponent,
        IssuerInfringementReportingComponent,
        AdminReportsPageComponent,
    ],
    exports: [ViewAdminReportsComponent, VehicleReportingComponent, SummaryReportingComponent, AdminReportsPageComponent],
    imports: [
        CommonModule,
        StoreModule.forFeature('reporting', fromReporting.reducer),
        EffectsModule.forFeature([ReportingEffects]),
        SharedModule,
        SpreadsheetModule,
    ],
})
export class AdminReportingModule {}
