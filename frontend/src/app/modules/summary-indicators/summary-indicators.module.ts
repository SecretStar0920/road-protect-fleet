import { NgModule } from '@angular/core';
import { SummaryIndicatorsComponent } from '@modules/summary-indicators/components/summary-indicators/summary-indicators.component';
import { SummaryIndicatorsPageComponent } from '@modules/summary-indicators/pages/summary-indicators-page/summary-indicators-page.component';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromSummaryIndicators from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { ManagedVehiclesComponent } from '@modules/summary-indicators/components/managed-vehicles/managed-vehicles.component';
import { InfringementCostComponent } from '@modules/summary-indicators/components/infringement-cost/infringement-cost.component';
import { RedirectionInformationComponent } from '@modules/summary-indicators/components/redirection-information/redirection-information.component';
import { UnmanagedVehiclesComponent } from '@modules/summary-indicators/components/unmanaged-vehicles/unmanaged-vehicles.component';
import { SpreadsheetModule } from '@modules/shared/modules/spreadsheet/spreadsheet.module';
import { EffectsModule } from '@ngrx/effects';
import { SummaryIndicatorEffects } from '@modules/summary-indicators/ngrx/summary-indicators.effects';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { ContractModule } from '@modules/contract/contract.module';

@NgModule({
    declarations: [
        SummaryIndicatorsPageComponent,
        SummaryIndicatorsComponent,
        InfringementCostComponent,
        UnmanagedVehiclesComponent,
        ManagedVehiclesComponent,
        RedirectionInformationComponent,
    ],
    imports: [
        SharedModule,
        StoreModule.forFeature('summary-indicators', fromSummaryIndicators.reducer),
        SpreadsheetModule,
        EffectsModule.forFeature([SummaryIndicatorEffects]),
        VehicleModule,
        InfringementModule,
        ContractModule,
    ],
    exports: [SummaryIndicatorsPageComponent],
    entryComponents: [SummaryIndicatorsPageComponent],
})
export class SummaryIndicatorsModule {}
