import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as fromDriver from '@modules/admin-driver/ngrx/driver.reducer';
import { SharedModule } from '@modules/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { I18NextModule } from 'angular-i18next';
import { DriverEffects } from '@modules/admin-driver/ngrx/driver.effects';
import { CreateDriverModalComponent } from '@modules/admin-driver/components/create-driver/create-driver-modal/create-driver-modal.component';
import { CreateDriverComponent } from '@modules/admin-driver/components/create-driver/create-driver.component';
import { DeleteDriverComponent } from '@modules/admin-driver/components/delete-driver/delete-driver.component';
import { ViewDriverModalComponent } from '@modules/admin-driver/components/view-driver/view-driver-modal/view-driver-modal.component';
import { ViewDriverComponent } from '@modules/admin-driver/components/view-driver/view-driver.component';
import { ViewDriverAdvancedComponent } from '@modules/admin-driver/components/view-driver-advanced/view-driver-advanced.component';
import { CreateDriverPageComponent } from '@modules/admin-driver/pages/create-driver-page/create-driver-page.component';
import { DriverPageComponent } from '@modules/admin-driver/pages/driver-page/driver.component';
import { UploadDriverPageComponent } from '@modules/admin-driver/pages/upload-driver-page/upload-driver-page.component';
import { ViewDriverPageComponent } from '@modules/admin-driver/pages/view-driver-page/view-driver-page.component';
import { DriverTagComponent } from '@modules/admin-driver/components/driver-tag/driver-tag.component';
import { UpdateDriverComponent } from '@modules/admin-driver/components/update-driver/update-driver-component';

@NgModule({
    declarations: [
        CreateDriverPageComponent,
        DriverPageComponent,
        UploadDriverPageComponent,
        ViewDriverPageComponent,
        CreateDriverModalComponent,
        ViewDriverAdvancedComponent,
        ViewDriverComponent,
        DriverTagComponent,
        ViewDriverModalComponent,
        DeleteDriverComponent,
        CreateDriverComponent,
        UpdateDriverComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('driver', fromDriver.reducer),
        EffectsModule.forFeature([DriverEffects]),
        I18NextModule,
    ],
    exports: [CreateDriverPageComponent, DriverPageComponent, UploadDriverPageComponent, ViewDriverPageComponent, DriverTagComponent],
    entryComponents: [CreateDriverModalComponent],
})
export class DriverModule {}
