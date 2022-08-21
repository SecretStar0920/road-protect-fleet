import * as fromGeneratedDocument from '@modules/generated-document/ngrx/generated-document.reducer';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GeneratedDocumentEffects } from '@modules/generated-document/ngrx/generated-document.effects';
import { CreateGeneratedDocumentComponent } from './components/create-generated-document/create-generated-document.component';
import { EditGeneratedDocumentComponent } from './components/edit-generated-document/edit-generated-document.component';
import { I18NextModule } from 'angular-i18next';
import { EditGeneratedDocumentPageComponent } from './components/edit-generated-document-page/edit-generated-document-page.component';

@NgModule({
    declarations: [CreateGeneratedDocumentComponent, EditGeneratedDocumentComponent, EditGeneratedDocumentPageComponent],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('generatedDocument', fromGeneratedDocument.reducer),
        EffectsModule.forFeature([GeneratedDocumentEffects]),
        I18NextModule,
    ],
    exports: [CreateGeneratedDocumentComponent],
    entryComponents: [EditGeneratedDocumentComponent],
})
export class GeneratedDocumentModule {}
