import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import { GraphingByStatusPageService } from '@modules/graphing/services/graphing-by-status-page.service';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { byStatus, dateRange } from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isNil } from 'lodash';
import { DatePipe } from '@angular/common';
import { colors } from '@modules/shared/constants/colors';
import i18next from 'i18next';
import { DateRangeDto, GraphingDataManipulationService } from '@modules/graphing/services/graphing-data-manipulation.service';

@Component({
    selector: 'rp-graphing-by-status-line-graph',
    templateUrl: './graphing-by-status-line-graph.component.html',
    styleUrls: ['./graphing-by-status-line-graph.component.less'],
})
export class GraphingByStatusLineGraphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    lineGraphData: NgxSeriesData[] = [];

    // options for line graph
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = i18next.t('graphing-by-status.year_and_month');
    yAxisLabel: string = i18next.t('graphing-by-status.total_amount');
    timeline: boolean = true;
    tooltipDisabled: boolean = true;
    dateRange: DateRangeDto = {};
    legendTitle: string = i18next.t('graphing-by-status.infringement_status');

    colors = { domain: colors.ant };

    constructor(
        private graphingByStatusPageService: GraphingByStatusPageService,
        private graphingDataManipulationService: GraphingDataManipulationService,
        private store: Store<GraphingState>,
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
                        originalOffenceDate: dataEntry.offenceDate,
                    };
                });

                const seriesNameKey = 'status';
                const data = this.graphingDataManipulationService.manipulateRawToNgxLineSeries(
                    translatedData,
                    seriesNameKey,
                    this.dateRange,
                );
                this.lineGraphData = data.lineGraphData;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
