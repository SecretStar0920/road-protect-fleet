import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromGlobalLoading from './ngrx/global-loading.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GlobalLoadingEffects } from './ngrx/global-loading.effects';
import { ViewHttpLoadingComponent } from '@modules/shared/modules/global-loading/component/view-http-loading/view-http-loading.component';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';

@NgModule({
    declarations: [ViewHttpLoadingComponent],
    imports: [
        CommonModule,
        MinimalSharedModule,
        StoreModule.forFeature('globalLoading', fromGlobalLoading.reducer),
        EffectsModule.forFeature([GlobalLoadingEffects]),
    ],
    exports: [ViewHttpLoadingComponent],
})
export class GlobalLoadingModule {}
