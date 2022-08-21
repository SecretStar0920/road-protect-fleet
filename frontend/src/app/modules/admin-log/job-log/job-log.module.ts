import * as fromJobLog from '@modules/admin-log/job-log/ngrx/job-log.reducer';
import { JobLogsPageComponent } from '@modules/admin-log/job-log/pages/job-logs-page/job-logs-page.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ViewJobLogComponent } from '@modules/admin-log/job-log/components/view-job-log/view-job-log.component';
import { ViewJobLogModalComponent } from '@modules/admin-log/job-log/components/view-job-log/view-job-log-modal/view-job-log-modal.component';
import { ViewJobLogPageComponent } from '@modules/admin-log/job-log/pages/view-job-log-page/view-job-log-page.component';
import { JobLogEffects } from '@modules/admin-log/job-log/ngrx/job-log.effects';
import { I18NextModule } from 'angular-i18next';
import { ViewJobLogsAdvancedComponent } from '@modules/admin-log/job-log/components/view-job-logs-advanced/view-job-logs-advanced.component';

@NgModule({
    declarations: [
        ViewJobLogComponent,
        ViewJobLogPageComponent,
        ViewJobLogModalComponent,
        JobLogsPageComponent,
        ViewJobLogsAdvancedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('jobLog', fromJobLog.reducer),
        EffectsModule.forFeature([JobLogEffects]),
        I18NextModule,
    ],
    exports: [ViewJobLogComponent, ViewJobLogPageComponent, ViewJobLogModalComponent, JobLogsPageComponent],
    entryComponents: [ViewJobLogModalComponent],
})
export class JobLogModule {}
