import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LocationState } from '@modules/location/ngrx/location.reducer';
import { select, Store } from '@ngrx/store';
import { Location, PhysicalLocation } from '@modules/shared/models/entities/location.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { LocationService } from '@modules/location/services/location.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { getLocationById } from '@modules/location/ngrx/location.selectors';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'rp-view-location',
    templateUrl: './view-location.component.html',
    styleUrls: ['./view-location.component.less'],
})
export class ViewLocationComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() locationId: number;
    location: PhysicalLocation;

    updateLocationState: ElementStateModel<Location> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Location>> = new EventEmitter();

    private destroy$ = new Subject();



    constructor(private store: Store<LocationState>, private logger: NGXLogger, private locationService: LocationService) {}

    ngOnInit() {
        this.getLocation();
    }

    getLocation() {
        this.store
            .pipe(
                select(getLocationById(this.locationId), takeUntil(this.destroy$)),
                tap((location) => {
                    if (!location) {
                        this.logger.debug('Location not found on store, querying for it');
                        this.locationService.getLocation(this.locationId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.location = plainToClass(PhysicalLocation, result);
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Location>) {
        this.onUpdate();
        this.updateLocationState = state;
    }

    onDelete(deleteState: ElementStateModel<Location>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
