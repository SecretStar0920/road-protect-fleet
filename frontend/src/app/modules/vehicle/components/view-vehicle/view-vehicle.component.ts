import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { of, Subject } from 'rxjs';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { NGXLogger } from 'ngx-logger';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { vehicleNgrxHelper, VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { select, Store } from '@ngrx/store';
import { ContractStatus } from '@modules/shared/models/entities/contract.model';
import { VehicleService } from '@modules/vehicle/services/vehicle.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { switchMap, takeUntil } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';

@Component({
    selector: 'rp-view-vehicle',
    templateUrl: './view-vehicle.component.html',
    styleUrls: ['./view-vehicle.component.less'],
})
export class ViewVehicleComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() vehicleId: number;
    vehicle: Vehicle;

    updateVehicleState: ElementStateModel<Vehicle> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Vehicle>> = new EventEmitter();

    private destroy$ = new Subject();

    leaseStatus = ContractStatus;

    permissions = PERMISSIONS;

    constructor(private store: Store<VehicleState>, private logger: NGXLogger, private vehicleService: VehicleService) {
        this.store.dispatch(infringementNgrxHelper.setQueryParams({ query: { mine: false } }));
    }

    ngOnInit() {
        this.getVehicle();
    }

    getVehicle() {
        this.store
            .pipe(
                select(vehicleNgrxHelper.selectEntityById(this.vehicleId)),
                takeUntil(this.destroy$),
                switchMap((vehicle) => {
                    if (!vehicle) {
                        this.logger.debug('Vehicle not found on store, querying for it');
                        return this.vehicleService.getVehicle(this.vehicleId);
                    }

                    return of(vehicle);
                }),
            )
            .subscribe((result) => {
                this.vehicle = result;
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Vehicle>) {
        this.onUpdate();
        this.updateVehicleState = state;
    }

    onDelete(deleteState: ElementStateModel<Vehicle>) {
        this.destroy$.next();
        if (deleteState.hasSucceeded()) {
            this.delete.emit(deleteState);
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetInfringementQueryParameters());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
