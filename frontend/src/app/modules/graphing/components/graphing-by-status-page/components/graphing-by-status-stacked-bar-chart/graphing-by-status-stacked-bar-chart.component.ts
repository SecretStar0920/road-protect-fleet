import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { GraphingByStatusPageService } from '@modules/graphing/services/graphing-by-status-page.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { byStatus, dateRange } from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { DatePipe } from '@angular/common';
import { colors } from '@modules/shared/constants/colors';
import i18next from 'i18next';
import { DateRangeDto, GraphingDataManipulationService } from '@modules/graphing/services/graphing-data-manipulation.service';

@Component({
    selector: 'rp-graphing-by-status-stacked-bar-chart',
    templateUrl: './graphing-by-status-stacked-bar-chart.component.html',
    styleUrls: ['./graphing-by-status-stacked-bar-chart.component.less'],
})
export class GraphingByStatusStackedBarChartComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    stackedBar: NgxSeriesData[];

    // options for bar graph
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = i18next.t('graphing-by-status.year_and_month');
    showYAxisLabel: boolean = true;
    yAxisLabel: string = i18next.t('graphing-by-status.total_amount');
    animations: boolean = true;
    dateRange: DateRangeDto = {};
    tooltipDisabled: boolean = true;
    legendTitle: string = i18next.t('graphing-by-status.infringement_status');

    colors = { domain: colors.ant };

    constructor(
        private graphingByStatusPageService: GraphingByStatusPageService,
        private store: Store<GraphingState>,
        private graphingDataManipulationService: GraphingDataManipulationService,
        private datePipe: DatePipe,
    ) {}

    async ngOnInit() {
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.dateRange = result;
            }
        });
        this.store.pipe(select(byStatus), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                const translatedData = result.map((dataEntry) => {
                    return {
                        ...dataEntry,
                        status: i18next.t('infringement-status.' + dataEntry.status),
                        offenceDate: this.datePipe.transform(new Date(dataEntry.offenceDate), 'yyyy MMMM'),
                        originalOffenceDate: dataEntry.offenceDate
                    };
                });

                const seriesValueKey = 'status';
                this.stackedBar = this.graphingDataManipulationService.manipulateRawToNgXBarGraph(
                    translatedData,
                    seriesValueKey,
                    this.dateRange
                );

            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
