import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as fromPartialInfringement from '@modules/admin-partial-infringement/ngrx/partial-infringement.reducer';
import { SharedModule } from '@modules/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { I18NextModule } from 'angular-i18next';
import { PartialInfringementEffects } from '@modules/admin-partial-infringement/ngrx/partial-infringement.effects';
import { ViewPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/view-partial-infringement-page/view-partial-infringement-page.component';
import { ViewPartialInfringementAdvancedComponent } from '@modules/admin-partial-infringement/components/view-partial-infringement-advanced/view-partial-infringement-advanced.component';
import { PartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/partial-infringement-page/partial-infringement.component';
import { ViewPartialInfringementModalComponent } from '@modules/admin-partial-infringement/components/view-partial-infringement/view-partial-infringement-modal/view-partial-infringement-modal.component';
import { ViewPartialInfringementComponent } from '@modules/admin-partial-infringement/components/view-partial-infringement/view-partial-infringement.component';
import { CreatePartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/create-partial-infringement-page/create-partial-infringement-page.component';
import { CreatePartialInfringementComponent } from '@modules/admin-partial-infringement/components/create-partial-infringement/create-partial-infringement.component';
import { CreatePartialInfringementModalComponent } from '@modules/admin-partial-infringement/components/create-partial-infringement/create-partial-infringement-modal/create-partial-infringement-modal.component';
import { DeletePartialInfringementComponent } from '@modules/admin-partial-infringement/components/delete-partial-infringement/delete-partial-infringement.component';
import { UploadPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/upload-partial-infringements-page/upload-partial-infringement-page.component';
import { ViewPartialInfringementStatusComponent } from '@modules/admin-partial-infringement/components/view-partial-infringement-status/view-partial-infringement-status.component';
import { FetchPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/fetch-partial-infringements-page/fetch-partial-infringement-page.component';
import { UploadOcrPartialInfringementPageComponent } from '@modules/admin-partial-infringement/pages/upload-ocr-partial-infringements-page/upload-ocr-partial-infringement-page.component';
import { OcrFileUploadComponent } from '@modules/admin-partial-infringement/components/ocr-file-upload/ocr-file-upload.component';
import { ViewOcrPartialInfringementsComponent } from '@modules/admin-partial-infringement/components/view-ocr-partial-infringements/view-ocr-partial-infringements.component';

@NgModule({
    declarations: [
        ViewPartialInfringementComponent,
        ViewPartialInfringementPageComponent,
        ViewPartialInfringementModalComponent,
        PartialInfringementPageComponent,
        FetchPartialInfringementPageComponent,
        ViewPartialInfringementAdvancedComponent,
        DeletePartialInfringementComponent,
        CreatePartialInfringementPageComponent,
        CreatePartialInfringementComponent,
        CreatePartialInfringementModalComponent,
        UploadPartialInfringementPageComponent,
        UploadOcrPartialInfringementPageComponent,
        OcrFileUploadComponent,
        ViewOcrPartialInfringementsComponent,
        ViewPartialInfringementStatusComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('partialInfringement', fromPartialInfringement.reducer),
        EffectsModule.forFeature([PartialInfringementEffects]),
        I18NextModule,
    ],
    exports: [
        ViewPartialInfringementComponent,
        ViewPartialInfringementPageComponent,
        ViewPartialInfringementModalComponent,
        CreatePartialInfringementPageComponent,
        PartialInfringementPageComponent,
    ],
    entryComponents: [ViewPartialInfringementModalComponent],
})
export class PartialInfringementModule {}
