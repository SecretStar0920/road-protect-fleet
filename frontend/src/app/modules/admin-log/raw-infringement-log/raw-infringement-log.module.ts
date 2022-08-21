import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ViewRawInfringementLogModalComponent } from '@modules/admin-log/raw-infringement-log/components/view-raw-infringement-log/view-raw-infringement-log-modal/view-raw-infringement-log-modal.component';
import { ViewRawInfringementLogPageComponent } from '@modules/admin-log/raw-infringement-log/pages/view-raw-infringement-log-page/view-raw-infringement-log-page.component';
import { ViewRawInfringementLogComponent } from '@modules/admin-log/raw-infringement-log/components/view-raw-infringement-log/view-raw-infringement-log.component';
import { ViewRawInfringementLogsAdvancedComponent } from '@modules/admin-log/raw-infringement-log/components/view-raw-infringement-logs-advanced/view-raw-infringement-logs-advanced.component';
import { RawInfringementLogEffects } from '@modules/admin-log/raw-infringement-log/ngrx/raw-infringement-log.effects';
import * as fromRawInfringementLog from '@modules/admin-log/raw-infringement-log/ngrx/raw-infringement-log.reducer';
import { RawInfringementLogsPageComponent } from '@modules/admin-log/raw-infringement-log/pages/raw-infringement-logs-page/raw-infringement-logs-page.component';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { SharedModule } from '@modules/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { I18NextModule } from 'angular-i18next';

@NgModule({
    declarations: [
        ViewRawInfringementLogComponent,
        ViewRawInfringementLogPageComponent,
        ViewRawInfringementLogModalComponent,
        RawInfringementLogsPageComponent,
        ViewRawInfringementLogsAdvancedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('rawInfringementLog', fromRawInfringementLog.reducer),
        EffectsModule.forFeature([RawInfringementLogEffects]),
        InfringementModule,
        I18NextModule,
    ],
    exports: [
        ViewRawInfringementLogComponent,
        ViewRawInfringementLogPageComponent,
        ViewRawInfringementLogModalComponent,
        RawInfringementLogsPageComponent,
    ],
    entryComponents: [ViewRawInfringementLogModalComponent],
})
export class RawInfringementLogModule {}
