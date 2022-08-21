import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StreetEffects } from '@modules/street/ngrx/street.effects';
import * as fromStreet from '@modules/street/ngrx/street.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

// Import issue if leave street autocomplete component here so moving to shared module
@NgModule({
    declarations: [],
    imports: [SharedModule, StoreModule.forFeature('street', fromStreet.reducer), EffectsModule.forFeature([StreetEffects])],
    exports: [],
})
export class StreetModule {}
