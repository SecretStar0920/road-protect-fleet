import { NgModule } from '@angular/core';
import { InfringementProjectionTableComponent } from '@modules/infringement-projection/components/infringement-projection-table/infringement-projection-table.component';
import { InfringementProjectionPageComponent } from '@modules/infringement-projection/pages/infringement-projection-page/infringement-projection-page.component';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromInfringementProjection from '@modules/infringement-projection/ngrx/infringement-projection.reducer';
import { InfringementProjectionEffects } from '@modules/infringement-projection/ngrx/infringement-projection.effects';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { InfringementProjectionOwnerPageComponent } from '@modules/infringement-projection/pages/infringement-projection-owner-page/infringement-projection-owner-page.component';
import { InfringementProjectionUserPageComponent } from '@modules/infringement-projection/pages/infringement-projection-user-page/infringement-projection-user-page.component';
import { InfringementProjectionHybridPageComponent } from '@modules/infringement-projection/pages/infringement-projection-hybrid-page/infringement-projection-hybrid-page.component';

@NgModule({
    declarations: [
        InfringementProjectionTableComponent,
        InfringementProjectionUserPageComponent,
        InfringementProjectionOwnerPageComponent,
        InfringementProjectionHybridPageComponent,
        InfringementProjectionPageComponent,
    ],
    imports: [
        SharedModule,
        StoreModule.forFeature('infringement-projection', fromInfringementProjection.reducer),
        EffectsModule.forFeature([InfringementProjectionEffects]),
        InfringementModule,
        VehicleModule,
    ],
    exports: [],
    entryComponents: [],
})
export class InfringementProjectionModule {}
