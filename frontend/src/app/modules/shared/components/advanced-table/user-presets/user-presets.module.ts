import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromUserPreset from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserPresetEffects } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.effects';

@NgModule({
    declarations: [],
    imports: [
        MinimalSharedModule,
        StoreModule.forFeature('userPreset', fromUserPreset.reducer),
        EffectsModule.forFeature([UserPresetEffects]),
    ],
    exports: [],
})
export class UserPresetsModule {}
