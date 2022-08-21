import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxDataPoint } from '@modules/shared/models/ngx-series-data.model';
import { GraphingByStatusPageService } from '@modules/graphing/services/graphing-by-status-page.service';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { byStatus, dateRange } from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { cloneDeep, isNil } from 'lodash';
import { colors } from '@modules/shared/constants/colors';
import i18next from 'i18next';
import { DateRangeDto, GraphingDataManipulationService } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';

@Component({
    selector: 'rp-graphing-by-status-pie-chart',
    templateUrl: './graphing-by-status-pie-chart.component.html',
    styleUrls: ['./graphing-by-status-pie-chart.component.less'],
})
export class GraphingByStatusPieChartComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    graphingType: GraphingTypes = GraphingTypes.PieChart;
    pieChartData: NgxDataPoint[];
    dateRange: DateRangeDto = {};
    colors = { domain: colors.ant };
    showDataLabel: boolean = true;
    showLegend: boolean = false;
    legendTitle: string = i18next.t('graphing-by-status.infringement_status');

    constructor(
        private graphingByStatusPageService: GraphingByStatusPageService,
        private graphingDataManipulationService: GraphingDataManipulationService,
        private store: Store<GraphingState>,
    ) {}

    async ngOnInit() {
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.dateRange = result;
            }
        });
        this.store.pipe(select(byStatus), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                const mappedData: NgxDataPoint[] = [];
                result.map((dataEntry) => {
                    const foundIndex = mappedData.findIndex(
                        (datapoint) => datapoint.name === i18next.t('infringement-status.' + dataEntry?.status),
                    );
                    if (foundIndex >= 0) {
                        mappedData[foundIndex].value += Number(dataEntry?.count);
                        mappedData[foundIndex].extra.cost += Number(dataEntry?.sum);
                    } else {
                        mappedData.push({
                            name: i18next.t('infringement-status.' + dataEntry?.status),
                            value: Number(dataEntry?.count),
                            extra: { cost: Number(dataEntry?.sum) },
                        });
                    }
                    return;
                });
                this.pieChartData = cloneDeep(mappedData);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
