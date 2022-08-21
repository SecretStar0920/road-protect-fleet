import * as fromVehicle from '@modules/vehicle/ngrx/vehicle.reducer';
import { VehiclesPageComponent } from '@modules/vehicle/components/vehicles-page/vehicles-page.component';
import { CommonModule } from '@angular/common';
import { CreateVehicleComponent } from '@modules/vehicle/components/create-vehicle/create-vehicle.component';
import { CreateVehicleModalComponent } from '@modules/vehicle/components/create-vehicle/create-vehicle-modal/create-vehicle-modal.component';
import { CreateVehiclePageComponent } from '@modules/vehicle/components/create-vehicle/create-vehicle-page/create-vehicle-page.component';
import { DeleteVehicleComponent } from './components/delete-vehicle/delete-vehicle.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateVehicleComponent } from '@modules/vehicle/components/update-vehicle/update-vehicle.component';
import { ViewVehicleComponent } from '@modules/vehicle/components/view-vehicle/view-vehicle.component';
import { ViewVehicleModalComponent } from '@modules/vehicle/components/view-vehicle/view-vehicle-modal/view-vehicle-modal.component';
import { ViewVehiclePageComponent } from '@modules/vehicle/components/view-vehicle/view-vehicle-page/view-vehicle-page.component';
import { VehicleEffects } from '@modules/vehicle/ngrx/vehicle.effects';
import { ContractModule } from '@modules/contract/contract.module';
import { InfringementModule } from '@modules/infringement/infringement.module';
import { LogModule } from '@modules/log/log.module';
import { UploadVehiclesPageComponent } from '@modules/vehicle/components/upload-vehicles-page/upload-vehicles-page.component';
import { ViewVehiclesAdvancedComponent } from '@modules/vehicle/components/view-vehicles-advanced/view-vehicles-advanced.component';
import { VehicleManufacturerAutocompleteComponent } from './components/vehicle-manufacturer-autocomplete/vehicle-manufacturer-autocomplete.component';
import { VehicleCategoryAutocompleteComponent } from '@modules/vehicle/components/vehicle-category-autocomplete/vehicle-category-autocomplete.component';
import { VehicleTypeDropdownComponent } from './components/vehicle-type-dropdown/vehicle-type-dropdown.component';

@NgModule({
    declarations: [
        ViewVehicleComponent,
        CreateVehicleComponent,
        UpdateVehicleComponent,
        CreateVehicleModalComponent,
        CreateVehiclePageComponent,
        ViewVehiclePageComponent,
        ViewVehicleModalComponent,
        VehiclesPageComponent,
        DeleteVehicleComponent,
        UploadVehiclesPageComponent,
        ViewVehiclesAdvancedComponent,
        VehicleManufacturerAutocompleteComponent,
        VehicleCategoryAutocompleteComponent,
        VehicleTypeDropdownComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('vehicle', fromVehicle.reducer),
        EffectsModule.forFeature([VehicleEffects]),
        ContractModule,
        InfringementModule,
        LogModule,
    ],
    exports: [
        ViewVehicleComponent,
        CreateVehicleComponent,
        UpdateVehicleComponent,
        CreateVehicleModalComponent,
        CreateVehiclePageComponent,
        ViewVehiclePageComponent,
        ViewVehicleModalComponent,
        VehiclesPageComponent,
        DeleteVehicleComponent,
        UploadVehiclesPageComponent,
        ViewVehiclesAdvancedComponent,
    ],
    entryComponents: [CreateVehicleModalComponent, ViewVehicleModalComponent],
})
export class VehicleModule {}
