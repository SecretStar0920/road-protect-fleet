import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { NominationStatus } from '@modules/shared/models/entities/nomination.model';
import { NgxDataPoint, NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';
import {
    getComparisonDates,
    getIsDateComparison,
    getThisYearRedirectionData,
    getYearComparisonRedirectionData,
} from '@modules/summary-indicators/ngrx/summary-indicators.selector';
import i18next from 'i18next';
import { cloneDeep } from 'lodash';
import { SummaryIndicatorTypes, updatedInfringementView } from '@modules/summary-indicators/ngrx/summary-indicators.actions';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import * as moment from 'moment';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';

@Component({
    selector: 'rp-redirection-information',
    templateUrl: 'redirection-information.component.html',
    styleUrls: ['./redirection-information.component.less'],
})
export class RedirectionInformationComponent implements OnInit, OnDestroy {
    isComparingDates: boolean = false;
    private destroy$ = new Subject();
    graphData: NgxDataPoint[];
    comparisonGraphingData: NgxSeriesData[] = [];
    graphingType: GraphingTypes = GraphingTypes.PieChartGrid;
    comparisonGraphing: GraphingTypes = GraphingTypes.GroupedVerticalBarGraph;
    nominationStatus = NominationStatus;
    selectedDates: SliderDateRangeDto;
    comparisonDates: SliderDateRangeDto;
    constructor(private store: Store<SummaryIndicatorsState>) {}

    ngOnInit() {
        this.store.pipe(select(getIsDateComparison), takeUntil(this.destroy$)).subscribe((result) => (this.isComparingDates = result));
        this.store.pipe(select(getThisYearRedirectionData), takeUntil(this.destroy$)).subscribe((rawData) => {
            if (rawData) {
                const data = cloneDeep(rawData);
                data.map((dataPoint) => {
                    dataPoint.name = i18next.t(dataPoint.name);
                });
                this.graphData = data;
            }
        });
        this.store.pipe(select(getComparisonDates), takeUntil(this.destroy$)).subscribe((result) => (this.comparisonDates = result));
        this.store.pipe(select(getYearComparisonRedirectionData), takeUntil(this.destroy$)).subscribe((rawData) => {
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

    onViewInfringements() {
        this.store.dispatch(updatedInfringementView({ viewInfringementTable: SummaryIndicatorTypes.RedirectionInformation }));
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
