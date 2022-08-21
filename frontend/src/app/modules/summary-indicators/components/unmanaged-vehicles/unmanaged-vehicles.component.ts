import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import {
    getComparisonDates,
    getIsDateComparison,
    getThisYearUnmanagedVehiclesData,
    getYearComparisonUnmanagedVehiclesData,
} from '@modules/summary-indicators/ngrx/summary-indicators.selector';
import { NgxDataPoint, NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';
import i18next from 'i18next';
import { cloneDeep } from 'lodash';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import * as moment from 'moment';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { SummaryIndicatorTypes, updatedInfringementView } from '@modules/summary-indicators/ngrx/summary-indicators.actions';

@Component({
    selector: 'rp-unmanaged-vehicles',
    templateUrl: 'unmanaged-vehicles.component.html',
    styleUrls: ['./unmanaged-vehicles.component.less'],
})
export class UnmanagedVehiclesComponent implements OnInit, OnDestroy {
    isComparingDates: boolean = false;
    private destroy$ = new Subject();
    infringementStatus = InfringementStatus;
    graphingData: NgxDataPoint[];
    graphingType: GraphingTypes = GraphingTypes.PieChartGrid;
    comparisonGraphing: GraphingTypes = GraphingTypes.GroupedVerticalBarGraph;
    comparisonGraphingData: NgxSeriesData[] = [];
    comparisonDates: SliderDateRangeDto;
    selectedDates: SliderDateRangeDto;

    constructor(private store: Store<SummaryIndicatorsState>) {}

    ngOnInit() {
        this.store.pipe(select(getIsDateComparison), takeUntil(this.destroy$)).subscribe((result) => (this.isComparingDates = result));
        this.store.pipe(select(getComparisonDates), takeUntil(this.destroy$)).subscribe((result) => (this.comparisonDates = result));
        this.store.pipe(select(getThisYearUnmanagedVehiclesData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                const data = cloneDeep(rawData);
                data.map((dataPoint) => {
                    dataPoint.name = i18next.t(dataPoint.name);
                });
                this.graphingData = data;
            }
        });
        this.store.pipe(select(getYearComparisonUnmanagedVehiclesData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                this.comparisonGraphingData = rawData;
            }
        });
        // Set default to be showing this years dates
        this.selectedDates = {
            startDate: moment().startOf('year').toISOString(),
            endDate: moment().endOf('year').toISOString(),
        };
    }

    onViewInfringementsNoContracts() {
        this.store.dispatch(updatedInfringementView({ viewInfringementTable: SummaryIndicatorTypes.UnmanagedVehicles }));
        if (this.isComparingDates) {
            this.selectedDates = this.comparisonDates;
        }
        this.store.dispatch(
            infringementNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    mine: true,
                    via: 'noContracts',
                    ...this.selectedDates,
                },
            }),
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
        this.store.dispatch(resetInfringementQueryParameters());
    }
}
