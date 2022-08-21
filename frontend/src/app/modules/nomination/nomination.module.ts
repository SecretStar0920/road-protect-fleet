import * as fromNomination from '@modules/nomination/ngrx/nomination.reducer';
import { NominationsPageComponent } from '@modules/nomination/pages/nominations-page/nominations-page.component';
import { CommonModule } from '@angular/common';
import { CreateNominationComponent } from '@modules/nomination/components/create-nomination/create-nomination.component';
import { CreateNominationModalComponent } from '@modules/nomination/components/create-nomination/create-nomination-modal/create-nomination-modal.component';
import { CreateNominationPageComponent } from '@modules/nomination/components/create-nomination/create-nomination-page/create-nomination-page.component';
import { DeleteNominationComponent } from './components/delete-nomination/delete-nomination.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateNominationComponent } from '@modules/nomination/components/update-nomination/update-nomination.component';
import { ViewNominationComponent } from '@modules/nomination/components/view-nomination/view-nomination.component';
import { ViewNominationModalComponent } from '@modules/nomination/components/view-nomination/view-nomination-modal/view-nomination-modal.component';
import { ViewNominationPageComponent } from '@modules/nomination/pages/view-nomination-page/view-nomination-page.component';
import { NominationEffects } from '@modules/nomination/ngrx/nomination.effects';
import { DigitallyRedirectNominationComponent } from './components/digitally-redirect-nomination/digitally-redirect-nomination.component';
import { DocumentModule } from '@modules/document/document.module';
import { PayNominationComponent } from './components/pay-nomination/pay-nomination.component';
import { ViewNominationsAdvancedComponent } from '@modules/nomination/components/view-nominations-advanced/view-nominations-advanced.component';
import { LocationModule } from '@modules/location/location.module';
import { BatchDigitallyRedirectionNominationsComponent } from '@modules/nomination/components/batch-digitally-redirect-nominations/batch-digitally-redirection-nominations.component';
import { AcknowledgeNominationComponent } from '@modules/nomination/components/acknowledge-nomination/acknowledge-nomination.component';
import { BatchAcknowledgeNominationsComponent } from '@modules/nomination/components/batch-acknowledge-nominations/batch-acknowledge-nominations.component';
import { MunicipallyRedirectNominationComponent } from './components/municipally-redirect-nomination/municipally-redirect-nomination.component';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { MunicipallyRedirectNominationPageComponent } from './components/municipally-redirect-nomination-page/municipally-redirect-nomination-page.component';
import { BatchPayNominationsComponent } from '@modules/nomination/components/batch-pay-nominations/batch-pay-nominations.component';
import { CheckRedirectionDetailsComponent } from '@modules/infringement/components/check-nomination-redirection-details/check-redirection-details.component';
import { ViewRedirectionDetailsComponent } from '@modules/infringement/components/view-redirection-details/view-redirection-details.component';
import { ViewNominationActionsComponent } from './components/view-nomination-actions/view-nomination-actions.component';
import { UpdateRedirectionStatusComponent } from '@modules/nomination/components/update-redirection-status/update-redirection-status.component';
import { ViewInfringementBatchActionsComponent } from '@modules/nomination/components/view-nomination-batch-actions/view-infringement-batch-actions.component';
import { BatchMunicipallyRedirectionNominationsComponent } from '@modules/nomination/components/batch-municipally-redirect-nominations/batch-municipally-redirection-nominations.component';
import * as fromInfringement from '@modules/infringement/ngrx/infringement.reducer';
import { InfringementEffects } from '@modules/infringement/ngrx/infringement.effects';
import { BatchApproveForPaymentComponent } from '@modules/nomination/components/batch-approve-for-payment/batch-approve-for-payment.component';

@NgModule({
    declarations: [
        ViewNominationComponent,
        CreateNominationComponent,
        UpdateNominationComponent,
        CreateNominationModalComponent,
        CreateNominationPageComponent,
        ViewNominationPageComponent,
        ViewNominationModalComponent,
        NominationsPageComponent,
        DeleteNominationComponent,
        DigitallyRedirectNominationComponent,
        PayNominationComponent,
        ViewNominationsAdvancedComponent,
        BatchApproveForPaymentComponent,
        BatchDigitallyRedirectionNominationsComponent,
        BatchPayNominationsComponent,
        AcknowledgeNominationComponent,
        BatchAcknowledgeNominationsComponent,
        MunicipallyRedirectNominationComponent,
        MunicipallyRedirectNominationPageComponent,
        CheckRedirectionDetailsComponent,
        ViewRedirectionDetailsComponent,
        ViewNominationActionsComponent,
        UpdateRedirectionStatusComponent,
        ViewInfringementBatchActionsComponent,
        BatchMunicipallyRedirectionNominationsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('nomination', fromNomination.reducer),
        EffectsModule.forFeature([NominationEffects]),

        StoreModule.forFeature('infringement', fromInfringement.reducer),
        EffectsModule.forFeature([InfringementEffects]),
        DocumentModule,
        LocationModule,
        GeneratedDocumentModule,
    ],
    exports: [
        ViewNominationComponent,
        CreateNominationComponent,
        UpdateNominationComponent,
        CreateNominationModalComponent,
        CreateNominationPageComponent,
        ViewNominationPageComponent,
        ViewNominationModalComponent,
        NominationsPageComponent,
        DeleteNominationComponent,
        ViewNominationsAdvancedComponent,
        AcknowledgeNominationComponent,
        BatchApproveForPaymentComponent,
        BatchDigitallyRedirectionNominationsComponent,
        BatchAcknowledgeNominationsComponent,
        BatchPayNominationsComponent,
        CheckRedirectionDetailsComponent,
        ViewRedirectionDetailsComponent,
        ViewNominationActionsComponent,
        UpdateRedirectionStatusComponent,
        ViewInfringementBatchActionsComponent,
        BatchMunicipallyRedirectionNominationsComponent,
    ],
    entryComponents: [CreateNominationModalComponent, ViewNominationModalComponent],
})
export class NominationModule {}
