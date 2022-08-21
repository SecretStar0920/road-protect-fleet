import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import {
    getComparisonDates,
    getIsDateComparison,
    getThisYearInfringementCostData,
    getYearComparisonInfringementCostData,
} from '@modules/summary-indicators/ngrx/summary-indicators.selector';
import { NgxDataPoint, NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';
import i18next from 'i18next';
import { SummaryIndicatorTypes, updatedInfringementView } from '@modules/summary-indicators/ngrx/summary-indicators.actions';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import * as moment from 'moment';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';

@Component({
    selector: 'rp-infringement-cost',
    templateUrl: 'infringement-cost.component.html',
    styleUrls: ['./infringement-cost.component.less'],
})
export class InfringementCostComponent implements OnInit, OnDestroy {
    isComparingDates: boolean = false;
    private destroy$ = new Subject();
    singleGraphingData: NgxDataPoint[];
    errorsFromCalculation: string[] = [];
    errorsFromCompareYearsCalculation: string[] = [];
    singleCountData: NgxDataPoint[];
    comparisonGraphingData: NgxSeriesData[] = [];
    comparisonCountData: NgxDataPoint[] = [];
    singleGraphing: GraphingTypes = GraphingTypes.HorizontalBarGraph;
    comparisonGraphing: GraphingTypes = GraphingTypes.GroupedVerticalBarGraph;
    graphingNumberCards: GraphingTypes = GraphingTypes.NumberCards;
    selectedDates: SliderDateRangeDto;
    comparisonDates: SliderDateRangeDto;

    constructor(private store: Store<SummaryIndicatorsState>) {}

    ngOnInit() {
        this.store.pipe(select(getIsDateComparison), takeUntil(this.destroy$)).subscribe((result) => (this.isComparingDates = result));
        this.store.pipe(select(getThisYearInfringementCostData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                // only current year
                for (const rawItem of rawData) {
                    if (rawItem.value === null) {
                        this.errorsFromCalculation.push(rawItem.name);
                    }
                }
                this.singleGraphingData = rawData.filter((data) => !data.name.includes('count') && data.value);
                this.singleCountData = [rawData.find((a) => a.name.includes('count'))];
            }
        });
        this.store.pipe(select(getYearComparisonInfringementCostData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                this.comparisonGraphingData = rawData.filter((data) => {
                    data.series.find((seriesItem) => {
                        if (seriesItem.value === null && !this.errorsFromCompareYearsCalculation.includes(data.name)) {
                            this.errorsFromCompareYearsCalculation.push(data.name);
                        }
                    });
                    return !data.name.includes('count') && data.series.reduce((a, b) => a + +b.value, 0);
                });
                this.comparisonCountData = rawData.find((a) => a.name.includes('count')).series;
            }
        });
        this.store.pipe(select(getComparisonDates), takeUntil(this.destroy$)).subscribe((result) => (this.comparisonDates = result));
        // Set default to be showing this years dates
        this.selectedDates = {
            startDate: moment().startOf('year').toISOString(),
            endDate: moment().endOf('year').toISOString(),
        };
    }

    onViewInfringements() {
        this.store.dispatch(updatedInfringementView({ viewInfringementTable: SummaryIndicatorTypes.InfringementCost }));
        if (this.isComparingDates) {
            this.selectedDates = this.comparisonDates;
        }
        this.store.dispatch(
            infringementNgrxHelper.setQueryParams({
                query: {
                    graphing: true,
                    mine: true,
                    via: 'onVehicles',
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
