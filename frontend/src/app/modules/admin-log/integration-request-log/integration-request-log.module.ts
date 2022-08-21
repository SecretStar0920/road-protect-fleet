import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ViewIntegrationRequestLogModalComponent } from '@modules/admin-log/integration-request-log/components/view-integration-request-log/view-integration-request-log-modal/view-integration-request-log-modal.component';
import { ViewIntegrationRequestLogPageComponent } from '@modules/admin-log/integration-request-log/pages/view-integration-request-log-page/view-integration-request-log-page.component';
import { ViewIntegrationRequestLogComponent } from '@modules/admin-log/integration-request-log/components/view-integration-request-log/view-integration-request-log.component';
import { ViewIntegrationRequestLogsAdvancedComponent } from '@modules/admin-log/integration-request-log/components/view-integration-request-logs-advanced/view-integration-request-logs-advanced.component';
import { IntegrationRequestLogEffects } from '@modules/admin-log/integration-request-log/ngrx/integration-request-log.effects';
import * as fromIntegrationRequestLog from '@modules/admin-log/integration-request-log/ngrx/integration-request-log.reducer';
import { IntegrationRequestLogsPageComponent } from '@modules/admin-log/integration-request-log/pages/integration-request-logs-page/integration-request-logs-page.component';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { SharedModule } from '@modules/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { I18NextModule } from 'angular-i18next';

@NgModule({
    declarations: [
        ViewIntegrationRequestLogComponent,
        ViewIntegrationRequestLogPageComponent,
        ViewIntegrationRequestLogModalComponent,
        IntegrationRequestLogsPageComponent,
        ViewIntegrationRequestLogsAdvancedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('integrationRequestLog', fromIntegrationRequestLog.reducer),
        EffectsModule.forFeature([IntegrationRequestLogEffects]),
        InfringementModule,
        I18NextModule,
    ],
    exports: [
        ViewIntegrationRequestLogComponent,
        ViewIntegrationRequestLogPageComponent,
        ViewIntegrationRequestLogModalComponent,
        IntegrationRequestLogsPageComponent,
    ],
    entryComponents: [ViewIntegrationRequestLogModalComponent],
})
export class IntegrationRequestLogModule {}
