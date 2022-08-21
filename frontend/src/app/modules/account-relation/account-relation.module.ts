import { AccountRelationsPageComponent } from '@modules/account-relation/pages/account-relations-page/account-relations-page.component';
import { CommonModule } from '@angular/common';
import { CreateAccountRelationComponent } from '@modules/account-relation/components/create-account-relation/create-account-relation.component';
import { CreateAccountRelationModalComponent } from '@modules/account-relation/components/create-account-relation/create-account-relation-modal/create-account-relation-modal.component';
import { CreateAccountRelationPageComponent } from '@modules/account-relation/pages/create-account-relation-page/create-account-relation-page.component';
import { DeleteAccountRelationComponent } from './components/delete-account-relation/delete-account-relation.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateAccountRelationComponent } from '@modules/account-relation/components/update-account-relation/update-account-relation.component';
import { ViewAccountRelationComponent } from '@modules/account-relation/components/view-account-relation/view-account-relation.component';
import { ViewAccountRelationModalComponent } from '@modules/account-relation/components/view-account-relation/view-account-relation-modal/view-account-relation-modal.component';
import { ViewAccountRelationPageComponent } from '@modules/account-relation/pages/view-account-relation-page/view-account-relation-page.component';
import { ViewAccountRelationsComponent } from '@modules/account-relation/components/view-account-relations/view-account-relations.component';
import { AccountRelationEffects } from '@modules/account-relation/ngrx/account-relation.effects';
import * as fromAccountRelation from './ngrx/account-relation.reducer';
import { ViewAccountRelationsAdvancedComponent } from '@modules/account-relation/components/view-account-relations-advanced/view-account-relations-advanced.component';
import { GenerateAccountRelationsComponent } from './components/generate-account-relations/generate-account-relations.component';
import { AccountRelationDocumentModule } from '@modules/account-relation-document/account-relation-document.module';
import { EmailAccountRelationInfringementReportComponent } from '@modules/account-relation/components/email-account-relation-infringement-report/email-account-relation-infringement-report.component';
import { UploadRelationsSpreadsheet } from '@modules/account-relation/components/upload-relations-spreadsheet/upload-relations-spreadsheet.component';
import { UploadRelationsSpreadsheetModalComponent } from '@modules/account-relation/components/upload-relations-spreadsheet/upload-relations-spreadsheet-modal/upload-relations-spreadsheet-modal.component';

@NgModule({
    declarations: [
        ViewAccountRelationComponent,
        ViewAccountRelationsComponent,
        CreateAccountRelationComponent,
        UpdateAccountRelationComponent,
        CreateAccountRelationModalComponent,
        CreateAccountRelationPageComponent,
        ViewAccountRelationPageComponent,
        ViewAccountRelationModalComponent,
        AccountRelationsPageComponent,
        DeleteAccountRelationComponent,
        ViewAccountRelationsAdvancedComponent,
        GenerateAccountRelationsComponent,
        EmailAccountRelationInfringementReportComponent,
        UploadRelationsSpreadsheet,
        UploadRelationsSpreadsheetModalComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('accountRelation', fromAccountRelation.reducer),
        EffectsModule.forFeature([AccountRelationEffects]),
        StoreModule.forFeature(fromAccountRelation.accountRelationsFeatureKey, fromAccountRelation.reducer),
        AccountRelationDocumentModule,
    ],
    exports: [
        ViewAccountRelationComponent,
        ViewAccountRelationsComponent,
        CreateAccountRelationComponent,
        UpdateAccountRelationComponent,
        CreateAccountRelationModalComponent,
        CreateAccountRelationPageComponent,
        ViewAccountRelationPageComponent,
        ViewAccountRelationModalComponent,
        AccountRelationsPageComponent,
        DeleteAccountRelationComponent,
        ViewAccountRelationsAdvancedComponent,
        EmailAccountRelationInfringementReportComponent,
    ],
    entryComponents: [
        CreateAccountRelationModalComponent,
        ViewAccountRelationModalComponent,
        EmailAccountRelationInfringementReportComponent,
    ],
})
export class AccountRelationModule {}
