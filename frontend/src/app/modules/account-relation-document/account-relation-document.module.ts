import { AccountRelationDocumentsPageComponent } from '@modules/account-relation-document/pages/account-relation-documents-page/account-relation-documents-page.component';
import { CommonModule } from '@angular/common';
import { CreateAccountRelationDocumentComponent } from '@modules/account-relation-document/components/create-account-relation-document/create-account-relation-document.component';
import { CreateAccountRelationDocumentModalComponent } from '@modules/account-relation-document/components/create-account-relation-document/create-account-relation-document-modal/create-account-relation-document-modal.component';
import { CreateAccountRelationDocumentPageComponent } from '@modules/account-relation-document/pages/create-account-relation-document-page/create-account-relation-document-page.component';
import { DeleteAccountRelationDocumentComponent } from './components/delete-account-relation-document/delete-account-relation-document.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateAccountRelationDocumentComponent } from '@modules/account-relation-document/components/update-account-relation-document/update-account-relation-document.component';
import { ViewAccountRelationDocumentComponent } from '@modules/account-relation-document/components/view-account-relation-document/view-account-relation-document.component';
import { ViewAccountRelationDocumentModalComponent } from '@modules/account-relation-document/components/view-account-relation-document/view-account-relation-document-modal/view-account-relation-document-modal.component';
import { ViewAccountRelationDocumentPageComponent } from '@modules/account-relation-document/pages/view-account-relation-document-page/view-account-relation-document-page.component';
import { ViewAccountRelationDocumentsComponent } from '@modules/account-relation-document/components/view-account-relation-documents/view-account-relation-documents.component';
import { AccountRelationDocumentEffects } from '@modules/account-relation-document/ngrx/account-relation-document.effects';
import * as fromAccountRelationDocument from './ngrx/account-relation-document.reducer';
import { DocumentModule } from '@modules/document/document.module';

@NgModule({
    declarations: [
        ViewAccountRelationDocumentComponent,
        ViewAccountRelationDocumentsComponent,
        CreateAccountRelationDocumentComponent,
        UpdateAccountRelationDocumentComponent,
        CreateAccountRelationDocumentModalComponent,
        CreateAccountRelationDocumentPageComponent,
        ViewAccountRelationDocumentPageComponent,
        ViewAccountRelationDocumentModalComponent,
        AccountRelationDocumentsPageComponent,
        DeleteAccountRelationDocumentComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('accountRelationDocument', fromAccountRelationDocument.reducer),
        EffectsModule.forFeature([AccountRelationDocumentEffects]),
        StoreModule.forFeature(fromAccountRelationDocument.accountRelationDocumentsFeatureKey, fromAccountRelationDocument.reducer),
        DocumentModule,
    ],
    exports: [
        ViewAccountRelationDocumentComponent,
        ViewAccountRelationDocumentsComponent,
        CreateAccountRelationDocumentComponent,
        UpdateAccountRelationDocumentComponent,
        CreateAccountRelationDocumentModalComponent,
        CreateAccountRelationDocumentPageComponent,
        ViewAccountRelationDocumentPageComponent,
        ViewAccountRelationDocumentModalComponent,
        AccountRelationDocumentsPageComponent,
        DeleteAccountRelationDocumentComponent,
    ],
    entryComponents: [CreateAccountRelationDocumentModalComponent, ViewAccountRelationDocumentModalComponent],
})
export class AccountRelationDocumentModule {}
