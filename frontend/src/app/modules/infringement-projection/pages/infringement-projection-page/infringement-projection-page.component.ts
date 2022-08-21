import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { InfringementProjectionState } from '@modules/infringement-projection/ngrx/infringement-projection.reducer';
import { takeUntil } from 'rxjs/operators';
import {
    GetInfringementProjectionDto,
    InfringementPredictionEndpoints,
    InfringementProjectionService,
} from '@modules/infringement-projection/services/infringement-projection.service';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { infringementQueryParameters } from '@modules/infringement/ngrx/infringement.selectors';
import { InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { clearInfringementProjectionData } from '@modules/infringement-projection/ngrx/infringement-projection.actions';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import { VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { vehicleQueryParameters } from '@modules/vehicle/ngrx/vehicle.selectors';
import { getEndpoint } from '@modules/infringement-projection/ngrx/infringement-projection.selector';

@Component({
    selector: 'rp-infringement-projection-page',
    templateUrl: './infringement-projection-page.component.html',
    styleUrls: ['./infringement-projection-page.component.less'],
})
export class InfringementProjectionPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    isLoading: boolean = false;
    // Infringement table
    filterKeyVisibility = FilterKeyVisibility;
    vehicleQueryParams: { startDate: string; endDate: string; via: string };
    infringementQueryParams: { startDate: string; endDate: string };
    viewInfringements: boolean = false;
    viewVehicles: boolean = false;
    endpoint: InfringementPredictionEndpoints;

    constructor(
        private store: Store<InfringementProjectionState>,
        private infringementStore: Store<InfringementState>,
        private vehicleStore: Store<VehicleState>,
        private infringementProjectionService: InfringementProjectionService,
    ) {}

    ngOnInit() {
        // Clear Infringement projection data
        this.store.dispatch(clearInfringementProjectionData());
        this.infringementStore
            .select(infringementQueryParameters)
            .pipe(takeUntil(this.destroy$))
            .subscribe((queryParams) => (this.infringementQueryParams = queryParams));
        this.vehicleStore
            .select(vehicleQueryParameters)
            .pipe(takeUntil(this.destroy$))
            .subscribe((queryParams) => (this.vehicleQueryParams = queryParams));
        this.store.pipe(select(getEndpoint), takeUntil(this.destroy$)).subscribe((endpoint) => {
            this.endpoint = endpoint;
        });
    }

    onViewInfringements(updatedQueryParams: boolean) {
        this.viewInfringements = updatedQueryParams;
    }

    onViewVehicles(updatedQueryParams: boolean) {
        this.viewVehicles = updatedQueryParams;
    }

    onChangeYears(dateRange?: SliderDateRangeDto) {
        if (this.isLoading) {
            return;
        }
        const dto: GetInfringementProjectionDto = {
            dateRange,
            endpoint: this.endpoint,
        };
        this.isLoading = true;
        this.infringementProjectionService
            .getInfringementProjectionData(dto)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isLoading = false;
            });
    }

    toggleVehicleCollapsed(): void {
        this.viewVehicles = !this.viewVehicles;
    }

    toggleInfringementsCollapsed(): void {
        this.viewInfringements = !this.viewInfringements;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
