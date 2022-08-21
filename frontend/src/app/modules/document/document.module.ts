import * as fromDocument from '@modules/document/ngrx/document.reducer';
import { DocumentsPageComponent } from '@modules/document/pages/documents-page/documents-page.component';
import { CommonModule } from '@angular/common';
import { CreateDocumentComponent } from '@modules/document/components/create-document/create-document.component';
import { CreateDocumentModalComponent } from '@modules/document/components/create-document/create-document-modal/create-document-modal.component';
import { CreateDocumentPageComponent } from '@modules/document/pages/create-document-page/create-document-page.component';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateDocumentComponent } from '@modules/document/components/update-document/update-document.component';
import { ViewDocumentModalComponent } from '@modules/document/components/view-document/view-document-modal/view-document-modal.component';
import { ViewDocumentPageComponent } from '@modules/document/pages/view-document-page/view-document-page.component';
import { ViewDocumentsComponent } from '@modules/document/components/view-documents/view-documents.component';
import { DocumentEffects } from '@modules/document/ngrx/document.effects';
import { CreateDocumentFormControlComponent } from './components/create-document/create-document-form-control/create-document-form-control.component';
import { SharedModule } from '@modules/shared/shared.module';
import { CreateAndLinkDocumentComponent } from './components/create-and-link-document/create-and-link-document.component';
import { CreateAndLinkDocumentPageComponent } from '@modules/document/pages/create-and-link-document-page/create-and-link-document-page.component';
import { CreateDocumentsComponent } from '@modules/document/components/create-document/create-documents/create-documents.component';
import { CreateDocumentsFormControlComponent } from '@modules/document/components/create-document/create-documents-form-control/create-documents-form-control.component';

@NgModule({
    declarations: [
        ViewDocumentsComponent,
        CreateDocumentComponent,
        CreateDocumentsComponent,
        UpdateDocumentComponent,
        CreateDocumentModalComponent,
        CreateDocumentPageComponent,
        ViewDocumentPageComponent,
        ViewDocumentModalComponent,
        DocumentsPageComponent,
        CreateDocumentFormControlComponent,
        CreateDocumentsFormControlComponent,
        CreateAndLinkDocumentComponent,
        CreateAndLinkDocumentPageComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('document', fromDocument.reducer),
        EffectsModule.forFeature([DocumentEffects]),
    ],
    exports: [
        ViewDocumentsComponent,
        CreateDocumentComponent,
        UpdateDocumentComponent,
        CreateDocumentModalComponent,
        CreateDocumentPageComponent,
        ViewDocumentPageComponent,
        ViewDocumentModalComponent,
        DocumentsPageComponent,
        CreateDocumentFormControlComponent,
        CreateDocumentsFormControlComponent,
    ],
    entryComponents: [CreateDocumentModalComponent, ViewDocumentModalComponent],
})
export class DocumentModule {}
