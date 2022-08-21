import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSeriesData } from '@modules/shared/models/ngx-series-data.model';
import i18next from 'i18next';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { colors } from '@modules/shared/constants/colors';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { dateRange, byVehicleBarGraphData } from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { GraphingParameters, graphingSelectedParameters } from '@modules/graphing/ngrx/graphing.actions';
import { mapTranslatedToInfringementStatus } from '@modules/graphing/services/map-translated-to-infringement-status.const';

@Component({
    selector: 'rp-graphing-by-vehicle-bar-chart',
    templateUrl: './graphing-by-vehicle-bar-chart.component.html',
    styleUrls: ['./graphing-by-vehicle-bar-chart.component.less'],
})
export class GraphingByVehicleBarChartComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    stackedBar: NgxSeriesData[];
    view: [number, number];
    barPadding = 1;

    // options for bar graph
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = i18next.t('graphing-by-vehicle.vehicle_registration');
    showYAxisLabel: boolean = true;
    yAxisLabel: string = i18next.t('graphing-by-vehicle.total_amount');
    animations: boolean = true;
    dateRange: DateRangeDto = {};
    tooltipDisabled: boolean = true;
    colors = { domain: colors.ant };

    constructor(private store: Store<GraphingState>) {}

    ngOnInit(): void {
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.dateRange = result;
            }
        });

        this.store.pipe(select(byVehicleBarGraphData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.stackedBar = result;
                this.view = this.stackedBar.length > 33 ? [Math.max(Math.floor(this.stackedBar.length) * 25), 400] : [1000, 400];
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onSelect(event) {
        //    handle status selected in legend
        if (typeof event === 'string') {
            // Map English and Hebrew to Infringement status
            const queryParameters: GraphingParameters = {
                endDate: this.dateRange.endDate,
                graphing: true,
                issuers: [],
                infringementStatus: mapTranslatedToInfringementStatus[event],
                startDate: this.dateRange.startDate,
                vehicleRegistration: null,
            };
            this.store.dispatch(graphingSelectedParameters({ data: queryParameters }));
        } else {
            //    if bar chart item is selected
            if (event.hasOwnProperty('name') && event.hasOwnProperty('series')) {
                const queryParameters: GraphingParameters = {
                    endDate: this.dateRange.endDate,
                    graphing: true,
                    issuers: [],
                    startDate: this.dateRange.startDate,
                    infringementStatus: mapTranslatedToInfringementStatus[event.name],
                    vehicleRegistration: event.series,
                };

                this.store.dispatch(graphingSelectedParameters({ data: queryParameters }));
            }
        }
    }

    transformXTick(tick) {
        return "\t" + tick + "\t"
    }
}
