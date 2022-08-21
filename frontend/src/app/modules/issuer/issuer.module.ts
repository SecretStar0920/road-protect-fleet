import * as fromIssuer from '@modules/issuer/ngrx/issuer.reducer';
import { IssuersPageComponent } from '@modules/issuer/pages/issuers-page/issuers-page.component';
import { CommonModule } from '@angular/common';
import { CreateIssuerComponent } from '@modules/issuer/components/create-issuer/create-issuer.component';
import { CreateIssuerModalComponent } from '@modules/issuer/components/create-issuer/create-issuer-modal/create-issuer-modal.component';
import { CreateIssuerPageComponent } from '@modules/issuer/pages/create-issuer-page/create-issuer-page.component';
import { DeleteIssuerComponent } from './components/delete-issuer/delete-issuer.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateIssuerComponent } from '@modules/issuer/components/update-issuer/update-issuer.component';
import { ViewIssuerComponent } from '@modules/issuer/components/view-issuer/view-issuer.component';
import { ViewIssuerModalComponent } from '@modules/issuer/components/view-issuer/view-issuer-modal/view-issuer-modal.component';
import { ViewIssuerPageComponent } from '@modules/issuer/components/view-issuer/view-issuer-page/view-issuer-page.component';
import { ViewIssuersComponent } from '@modules/issuer/components/view-issuers/view-issuers.component';
import { IssuerEffects } from '@modules/issuer/ngrx/issuer.effects';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { UploadIssuersPageComponent } from '@modules/issuer/pages/upload-issuers-page/upload-issuers-page.component';
import { I18NextModule } from 'angular-i18next';
import { ViewIssuersAdvancedComponent } from '@modules/issuer/components/view-issuers-advanced/view-issuers-advanced.component';

@NgModule({
    declarations: [
        ViewIssuerComponent,
        ViewIssuersComponent,
        CreateIssuerComponent,
        UpdateIssuerComponent,
        CreateIssuerModalComponent,
        CreateIssuerPageComponent,
        ViewIssuerPageComponent,
        ViewIssuerModalComponent,
        IssuersPageComponent,
        DeleteIssuerComponent,
        UploadIssuersPageComponent,
        ViewIssuersAdvancedComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('issuer', fromIssuer.reducer),
        EffectsModule.forFeature([IssuerEffects]),
        InfringementModule,
        I18NextModule,
    ],
    exports: [
        ViewIssuerComponent,
        ViewIssuersComponent,
        CreateIssuerComponent,
        UpdateIssuerComponent,
        CreateIssuerModalComponent,
        CreateIssuerPageComponent,
        ViewIssuerPageComponent,
        ViewIssuerModalComponent,
        IssuersPageComponent,
        DeleteIssuerComponent,
        UploadIssuersPageComponent,
    ],
    entryComponents: [CreateIssuerModalComponent, ViewIssuerModalComponent],
})
export class IssuerModule {}
