import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import i18next from 'i18next';
import { DateRangeDto, GraphingDataManipulationService } from '@modules/graphing/services/graphing-data-manipulation.service';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { dateRange, byIssuerLineGraphData, issuersToExclude } from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { colors } from '@modules/shared/constants/colors';
import { GraphingByIssuerPageService } from '@modules/graphing/services/graphing-by-issuer-page.service';
import { GraphingParameters, graphingSelectedParameters } from '@modules/graphing/ngrx/graphing.actions';

@Component({
    selector: 'rp-graphing-by-issuer-line-graph',
    templateUrl: './graphing-by-issuer-line-graph.component.html',
    styleUrls: ['./graphing-by-issuer-line-graph.component.less'],
})
export class GraphingByIssuerLineGraphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    lineGraphData: NgxSeriesData[] = [];
    issuersToExclude: string[];

    // options for line graph
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = i18next.t('graphing-by-issuer.year_and_month');
    yAxisLabel: string = i18next.t('graphing-by-issuer.total_amount');
    timeline: boolean = true;
    dateRange: DateRangeDto = {};
    tooltipDisabled: boolean = true;
    colors = { domain: colors.ant };

    constructor(
        private graphingByIssuerPageService: GraphingByIssuerPageService,
        private graphingDataManipulationService: GraphingDataManipulationService,
        private store: Store<GraphingState>,
    ) {}

    async ngOnInit() {
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.dateRange = result;
            }
        });
        this.store.pipe(select(byIssuerLineGraphData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.lineGraphData = result;
            }
        });
        this.store.pipe(select(issuersToExclude), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.issuersToExclude = result;
            }
        });
    }

    onSelect(event) {
        const queryParameters: GraphingParameters = {
            infringementStatus: null,
            vehicleRegistration: null,
            endDate: this.dateRange.endDate,
            graphing: true,
            issuers: [],
            startDate: this.dateRange.startDate,
        };
        if (typeof event === 'string') {
            //    handle issuer selected, line graph does return object unless tooltips are enabled in which case the tooltip bug would need to be resolved first

            if (event === i18next.t('graphing-by-issuer.other')) {
                //     Other series for bar graphs is not handles as the issuers that it consists of is different for different date ranges
                queryParameters.issuers = this.issuersToExclude;
            } else {
                queryParameters.issuers = [event];
            }

            this.store.dispatch(graphingSelectedParameters({ data: queryParameters }));
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
