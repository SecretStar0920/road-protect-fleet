import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { vehicleNgrxHelper } from '@modules/vehicle/ngrx/vehicle.reducer';

@Component({
    selector: 'rp-vehicles-page',
    templateUrl: './vehicles-page.component.html',
    styleUrls: ['./vehicles-page.component.less'],
})
export class VehiclesPageComponent implements OnInit {
    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.dispatch(vehicleNgrxHelper.setQueryParams({ query: { mine: false } }));
    }
}
