import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ContractStatus } from '@modules/shared/models/entities/contract.model';
import { NgxDataPoint, NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';
import {
    getComparisonDates,
    getIsDateComparison,
    getThisYearManagedVehiclesData,
    getYearComparisonManagedVehiclesData,
} from '@modules/summary-indicators/ngrx/summary-indicators.selector';
import * as moment from 'moment';
import { SummaryIndicatorTypes, updatedInfringementView } from '@modules/summary-indicators/ngrx/summary-indicators.actions';
import { contractNgrxHelper } from '@modules/contract/ngrx/contract.reducer';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import { resetContractQueryParameters } from '@modules/contract/ngrx/contract.actions';

@Component({
    selector: 'rp-managed-vehicles',
    templateUrl: 'managed-vehicles.component.html',
    styleUrls: ['./managed-vehicles.component.less'],
})
export class ManagedVehiclesComponent implements OnInit, OnDestroy {
    isComparingDates: boolean = false;
    private destroy$ = new Subject();
    contractStatus = ContractStatus;
    pieChartData: NgxDataPoint[];
    graphingData: NgxSeriesData[];
    comparisonGraphing: GraphingTypes = GraphingTypes.GroupedVerticalBarGraph;
    graphingType: GraphingTypes = GraphingTypes.AdvancedPieChart;
    selectedDates: SliderDateRangeDto;
    comparisonDates: SliderDateRangeDto;

    constructor(private store: Store<SummaryIndicatorsState>) {}

    ngOnInit() {
        this.store.pipe(select(getIsDateComparison), takeUntil(this.destroy$)).subscribe((result) => (this.isComparingDates = result));
        this.store.pipe(select(getThisYearManagedVehiclesData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                this.pieChartData = rawData;
            }
        });
        this.store.pipe(select(getYearComparisonManagedVehiclesData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                this.graphingData = rawData;
            }
        });
        this.store.pipe(select(getComparisonDates), takeUntil(this.destroy$)).subscribe((result) => (this.comparisonDates = result));
        // Set default to be showing this years dates
        this.selectedDates = {
            startDate: moment().startOf('year').toISOString(),
            endDate: moment().endOf('year').toISOString(),
        };
    }

    onViewContracts() {
        this.store.dispatch(updatedInfringementView({ viewInfringementTable: SummaryIndicatorTypes.ManagedVehicles }));
        if (this.isComparingDates) {
            this.selectedDates = this.comparisonDates;
        }
        this.store.dispatch(
            contractNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    via: 'managedVehicles',
                    ...this.selectedDates,
                },
            }),
        );
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
        this.store.dispatch(resetContractQueryParameters());
    }
}
