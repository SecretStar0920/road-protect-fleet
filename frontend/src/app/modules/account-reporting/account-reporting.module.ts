import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { AccountVehicleCountsComponent } from './components/account-vehicle-counts/account-vehicle-counts.component';
import { AccountReportsPageComponent } from './components/account-reports-page/account-reports-page.component';
import { ViewAccountReportsComponent } from '@modules/account-reporting/components/view-account-reports/view-account-reports.component';
import { StoreModule } from '@ngrx/store';
import * as fromAccountReporting from './ngrx/account-reporting.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AccountReportingEffects } from './ngrx/account-reporting.effects';
import { AccountInfringementCountsComponent } from '@modules/account-reporting/components/account-infringement-counts/account-infringement-counts.component';
import { AccountInfringementAmountsComponent } from '@modules/account-reporting/components/account-infringement-amounts/account-infringement-amounts.component';
import { AccountLeadingVehiclesComponent } from '@modules/account-reporting/components/account-leading-vehicles/account-leading-vehicles.component';
import { AccountMetabaseDashboardComponent } from './components/account-metabase-dashboard/account-metabase-dashboard.component';
import { AccountMetabaseReportListComponent } from './components/account-metabase-report-list/account-metabase-report-list.component';
import { MetabaseReportDetailsComponent } from '@modules/account-reporting/components/metabase-report-details/metabase-report-details.component';
import { MetabaseReportViewComponent } from './components/metabase-report-view/metabase-report-view.component';
import { AccountMetabaseKpiDashboardComponent } from './components/account-metabase-kpi-dashboard/account-metabase-kpi-dashboard.component';

@NgModule({
    declarations: [
        ViewAccountReportsComponent,
        AccountReportsPageComponent,
        AccountVehicleCountsComponent,
        AccountInfringementCountsComponent,
        AccountInfringementAmountsComponent,
        AccountLeadingVehiclesComponent,
        AccountMetabaseDashboardComponent,
        AccountMetabaseReportListComponent,
        MetabaseReportDetailsComponent,
        MetabaseReportViewComponent,
        AccountMetabaseKpiDashboardComponent,
    ],
    exports: [ViewAccountReportsComponent, AccountVehicleCountsComponent, AccountReportsPageComponent, MetabaseReportViewComponent],
    entryComponents: [MetabaseReportViewComponent],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature(fromAccountReporting.accountReportingFeatureKey, fromAccountReporting.reducer),
        EffectsModule.forFeature([AccountReportingEffects]),
    ],
})
export class AccountReportingModule {}
