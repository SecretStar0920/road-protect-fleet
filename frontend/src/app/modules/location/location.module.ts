import * as fromLocation from '@modules/location/ngrx/location.reducer';
import { LocationsPageComponent } from '@modules/location/components/locations-page/locations-page.component';
import { CommonModule } from '@angular/common';
import { CreateLocationComponent } from '@modules/location/components/create-location/create-location.component';
import { CreateLocationModalComponent } from '@modules/location/components/create-location/create-location-modal/create-location-modal.component';
import { CreateLocationPageComponent } from '@modules/location/components/create-location/create-location-page/create-location-page.component';
import { DeleteLocationComponent } from './components/delete-location/delete-location.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateLocationComponent } from '@modules/location/components/update-location/update-location.component';
import { ViewLocationComponent } from '@modules/location/components/view-location/view-location.component';
import { ViewLocationModalComponent } from '@modules/location/components/view-location/view-location-modal/view-location-modal.component';
import { ViewLocationPageComponent } from '@modules/location/components/view-location/view-location-page/view-location-page.component';
import { ViewLocationsComponent } from '@modules/location/components/view-locations/view-locations.component';
import { LocationEffects } from '@modules/location/ngrx/location.effects';

@NgModule({
    declarations: [
        ViewLocationComponent,
        ViewLocationsComponent,
        CreateLocationComponent,
        UpdateLocationComponent,
        CreateLocationModalComponent,
        CreateLocationPageComponent,
        ViewLocationPageComponent,
        ViewLocationModalComponent,
        LocationsPageComponent,
        DeleteLocationComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('location', fromLocation.reducer),
        EffectsModule.forFeature([LocationEffects]),
    ],
    exports: [
        ViewLocationComponent,
        ViewLocationsComponent,
        CreateLocationComponent,
        UpdateLocationComponent,
        CreateLocationModalComponent,
        CreateLocationPageComponent,
        ViewLocationPageComponent,
        ViewLocationModalComponent,
        LocationsPageComponent,
        DeleteLocationComponent,
    ],
    entryComponents: [CreateLocationModalComponent, ViewLocationModalComponent, ViewLocationsComponent],
})
export class LocationModule {}
