import * as fromInfringement from '@modules/infringement/ngrx/infringement.reducer';
import { InfringementsPageComponent } from '@modules/infringement/components/infringements-page/infringements-page.component';
import { CommonModule } from '@angular/common';
import { CreateInfringementComponent } from '@modules/infringement/components/create-infringement/create-infringement.component';
import { CreateInfringementModalComponent } from '@modules/infringement/components/create-infringement/create-infringement-modal/create-infringement-modal.component';
import { CreateInfringementPageComponent } from '@modules/infringement/components/create-infringement/create-infringement-page/create-infringement-page.component';
import { DeleteInfringementComponent } from './components/delete-infringement/delete-infringement.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateInfringementComponent } from '@modules/infringement/components/update-infringement/update-infringement.component';
import { ViewInfringementComponent } from '@modules/infringement/components/view-infringement/view-infringement.component';
import { ViewInfringementModalComponent } from '@modules/infringement/components/view-infringement/view-infringement-modal/view-infringement-modal.component';
import { ViewInfringementPageComponent } from '@modules/infringement/components/view-infringement/view-infringement-page/view-infringement-page.component';
import { InfringementEffects } from '@modules/infringement/ngrx/infringement.effects';
import { UploadInfringementsPageComponent } from '@modules/infringement/components/upload-infringements-page/upload-infringements-page.component';
import { LogModule } from '@modules/log/log.module';
import { NominationModule } from '@modules/nomination/nomination.module';
import { DocumentModule } from '@modules/document/document.module';
import { ViewInfringementsAdvancedComponent } from '@modules/infringement/components/view-infringements-advanced/view-infringements-advanced.component';
import { LocationModule } from '@modules/location/location.module';
import { InfringementCountByStatusComponent } from './components/infringement-count-by-status/infringement-count-by-status.component';
import { InfringementSystemStatusTagComponent } from './components/infringement-system-status-tag/infringement-system-status-tag.component';
import { PaymentModule } from '@modules/payment/payment.module';
import { InfringementTypeDropdownComponent } from './components/infringement-type-dropdown/infringement-type-dropdown.component';
import { InfringementNoteModule } from '@modules/infringement-note/infringement-note.module';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { InfringementSpreadsheetUploadComponent } from './components/infringement-spreadsheet-upload/infringement-spreadsheet-upload.component';
import { ViewMissingUpsertInfringementsComponent } from './components/infringement-spreadsheet-upload/view-missing-upsert-infringements/view-missing-upsert-infringements.component';
import { InfringementSpreadsheetUploadSummaryComponent } from './components/infringement-spreadsheet-upload/infringement-spreadsheet-upload-summary/infringement-spreadsheet-upload-summary.component';
import { ManualUpdateStatusComponent } from './components/manual-update-status/manual-update-status.component';
import { ContractModule } from '@modules/contract/contract.module';
import { AdminBatchActionsComponent } from './components/admin-batch-actions/admin-batch-actions.component';
import { ViewInfringementApprovalsComponent } from './components/view-infringement-approvals/view-infringement-approvals.component';
import { ViewInfringementPaymentsComponent } from '@modules/infringement/components/view-infringement-payments/view-infringement-payments.component';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { InfringementTagsComponent } from '@modules/infringement/components/infringement-tags/infringement-tags.component';
import { InfringementTagsDropdownComponent } from '@modules/infringement/components/infringement-tags-dropdown/infringement-tags-dropdown.component';

@NgModule({
    declarations: [
        ViewInfringementComponent,
        CreateInfringementComponent,
        UpdateInfringementComponent,
        CreateInfringementModalComponent,
        CreateInfringementPageComponent,
        ViewInfringementPageComponent,
        ViewInfringementModalComponent,
        InfringementsPageComponent,
        DeleteInfringementComponent,
        UploadInfringementsPageComponent,
        ViewInfringementsAdvancedComponent,
        InfringementCountByStatusComponent,
        InfringementSystemStatusTagComponent,
        InfringementTagsComponent,
        InfringementTagsDropdownComponent,
        InfringementTypeDropdownComponent,
        InfringementSpreadsheetUploadComponent,
        ViewMissingUpsertInfringementsComponent,
        InfringementSpreadsheetUploadSummaryComponent,
        ManualUpdateStatusComponent,
        AdminBatchActionsComponent,
        ViewInfringementApprovalsComponent,
        ViewInfringementPaymentsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('infringement', fromInfringement.reducer),
        EffectsModule.forFeature([InfringementEffects]),
        LogModule,
        NominationModule,
        DocumentModule,
        LocationModule,
        PaymentModule,
        InfringementNoteModule,
        GeneratedDocumentModule,
        ContractModule,
        LeaseContractModule,
    ],
    exports: [
        ViewInfringementComponent,
        CreateInfringementComponent,
        UpdateInfringementComponent,
        CreateInfringementModalComponent,
        CreateInfringementPageComponent,
        ViewInfringementPageComponent,
        ViewInfringementModalComponent,
        InfringementsPageComponent,
        DeleteInfringementComponent,
        ViewInfringementsAdvancedComponent,
        InfringementCountByStatusComponent,
        InfringementTypeDropdownComponent,
    ],
    entryComponents: [CreateInfringementModalComponent, ViewInfringementModalComponent],
})
export class InfringementModule {}
