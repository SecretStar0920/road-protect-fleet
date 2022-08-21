import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import i18next from 'i18next';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import * as moment from 'moment';
import { colors } from '@modules/shared/constants/colors';
import { GraphingByIssuerPageService } from '@modules/graphing/services/graphing-by-issuer-page.service';
import { dateRange, byIssuerBarGraphData, byIssuerOtherIssuersPerDateRange } from '@modules/graphing/ngrx/graphing.selector';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GraphingParameters, graphingSelectedParameters } from '@modules/graphing/ngrx/graphing.actions';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'rp-graphing-by-issuer-bar-graph',
    templateUrl: './graphing-by-issuer-bar-graph.component.html',
    styleUrls: ['./graphing-by-issuer-bar-graph.component.less'],
})
export class GraphingByIssuerBarGraphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    manipulatedData: any;
    stackedBar: NgxSeriesData[];
    issuersToExclude: string[];
    issuerTotals: { [key: string]: { name: string; total: number } };

    // options for bar graph
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = i18next.t('graphing-by-issuer.year_and_month');
    showYAxisLabel: boolean = true;
    yAxisLabel: string = i18next.t('graphing-by-issuer.total_amount');
    animations: boolean = true;
    dateRange: DateRangeDto = {};
    tooltipDisabled: boolean = true;
    otherIssuersPerDateRange: { [selectionDate: string]: string[] } = {};

    colors = { domain: colors.ant };

    constructor(
        private graphingByIssuerPageService: GraphingByIssuerPageService,
        private store: Store<GraphingState>,
        private datePipe: DatePipe,
    ) {}

    async ngOnInit() {
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.dateRange = result;
            }
        });

        this.store.pipe(select(byIssuerBarGraphData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.stackedBar = result;
            }
        });

        this.store.pipe(select(byIssuerOtherIssuersPerDateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.otherIssuersPerDateRange = result;
            }
        });
    }

    onSelect(event) {
        if (typeof event === 'string') {
            //    handle issuer selected
            if (event === i18next.t('graphing-by-issuer.other')) {
                //     Other series for bar graphs is not handles as the issuers that it consists of is different for different date ranges
                return;
            }
            const queryParameters: GraphingParameters = {
                infringementStatus: null,
                vehicleRegistration: null,
                endDate: this.dateRange.endDate,
                graphing: true,
                issuers: [event],
                startDate: this.dateRange.startDate,
            };
            this.store.dispatch(graphingSelectedParameters({ data: queryParameters }));
        } else {
            //    if bar chart item is selected
            if (event.hasOwnProperty('name') && event.hasOwnProperty('series')) {
                const startDate = moment
                    .utc(this.datePipe.transform(new Date(event.series)))
                    .startOf('month')
                    .toISOString();
                const endDate = moment
                    .utc(this.datePipe.transform(new Date(event.series)))
                    .endOf('month')
                    .toISOString();

                const queryParameters: GraphingParameters = {
                    infringementStatus: null,
                    vehicleRegistration: null,
                    endDate,
                    graphing: true,
                    issuers: [],
                    startDate,
                };
                if (event.name === i18next.t('graphing-by-issuer.other')) {
                    queryParameters.issuers = this.otherIssuersPerDateRange[event.series];
                } else {
                    queryParameters.issuers = [event.name];
                }

                this.store.dispatch(graphingSelectedParameters({ data: queryParameters }));
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
