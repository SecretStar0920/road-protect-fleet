import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { I18NextModule } from 'angular-i18next';
import { ViewRequestInformationLogComponent } from '@modules/admin-log/request-information-log/components/view-request-information-log/view-request-information-log.component';
import { CreateRequestInformationLogPageComponent } from '@modules/admin-log/request-information-log/pages/create-request-information-log-page/create-request-information-log-page.component';
import { ViewRequestInformationLogPageComponent } from '@modules/admin-log/request-information-log/components/view-request-information-log/view-request-information-log-page/view-request-information-log-page.component';
import { ViewRequestInformationLogModalComponent } from '@modules/admin-log/request-information-log/components/view-request-information-log/view-request-information-log-modal/view-request-information-log-modal.component';
import { UpdateRequestInformationLogComponent } from '@modules/admin-log/request-information-log/components/update-request-information-log/update-request-information-log.component';
import { RequestInformationLogsPageComponent } from '@modules/admin-log/request-information-log/pages/request-information-logs-page/request-information-logs-page.component';
import { RequestInformationLogEffects } from '@modules/admin-log/request-information-log/ngrx/request-information-log.effects';
import * as fromRequestInformationLog from '@modules/admin-log/request-information-log/ngrx/request-information-log.reducer';
import { ViewRequestInformationLogsAdvancedComponent } from '@modules/admin-log/request-information-log/components/view-request-information-logs-advanced/view-request-information-logs-advanced.component';

@NgModule({
    declarations: [
        ViewRequestInformationLogComponent,
        UpdateRequestInformationLogComponent,
        CreateRequestInformationLogPageComponent,
        ViewRequestInformationLogPageComponent,
        ViewRequestInformationLogModalComponent,
        RequestInformationLogsPageComponent,
        ViewRequestInformationLogsAdvancedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('requestInformationLog', fromRequestInformationLog.reducer),
        EffectsModule.forFeature([RequestInformationLogEffects]),
        InfringementModule,
        I18NextModule,
    ],
    exports: [
        ViewRequestInformationLogComponent,
        UpdateRequestInformationLogComponent,
        CreateRequestInformationLogPageComponent,
        ViewRequestInformationLogPageComponent,
        ViewRequestInformationLogModalComponent,
        RequestInformationLogsPageComponent,
        ViewRequestInformationLogsAdvancedComponent,
    ],
    entryComponents: [ViewRequestInformationLogModalComponent],
})
export class RequestInformationLogModule {}
