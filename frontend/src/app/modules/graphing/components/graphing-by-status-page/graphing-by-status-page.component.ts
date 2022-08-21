import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GraphingByStatusPageService } from '@modules/graphing/services/graphing-by-status-page.service';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isEmpty, isNil } from 'lodash';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import {
    GraphingParameters,
    loadComparison,
    loadGraph,
    resetInfringementViewTrigger,
    resolveComparison,
    resolveGraph,
    showPreviousYearComparison,
} from '@modules/graphing/ngrx/graphing.actions';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { Store } from '@ngrx/store';
import {
    dateRange,
    isComparisonLoading,
    isGraphLoading,
    selectedEndpoint,
    selectedParameters,
    triggerInfringementView,
} from '@modules/graphing/ngrx/graphing.selector';
import { resetInfringementQueryParameters } from '@modules/infringement/ngrx/infringement.actions';
import * as moment from 'moment';
import { ReportingEndpoints } from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';

@Component({
    selector: 'rp-graphing-by-status-page',
    templateUrl: './graphing-by-status-page.component.html',
    styleUrls: ['./graphing-by-status-page.component.less'],
})
export class GraphingByStatusPageComponent implements OnInit, OnDestroy {
    get graphDisplay(): string {
        return this._graphDisplay;
    }

    set graphDisplay(value: string) {
        this._graphDisplay = value;
    }

    constructor(private store: Store<InfringementState>, private graphingByStatusPageService: GraphingByStatusPageService) {}
    infringementQueryParams: GraphingParameters;
    showGraphs: boolean = false;
    noAggregatedData: boolean = false;
    private destroy$ = new Subject();
    endpoint: ReportingEndpoints;
    selectedParameters: GraphingParameters;
    triggerInfringementViewCount: number = 0;
    isComparisonLoading: number;
    isGraphLoading: number;
    dates: DateRangeDto;
    showInfringementsTable: boolean = false;

    private _graphDisplay: string = 'bar-graph';

    showLineGraph(): boolean {
        return this.graphDisplay === 'line-graph';
    }

    showBarGraph(): boolean {
        return this.graphDisplay === 'bar-graph';
    }

    ngOnInit() {
        this.store
            .select(dateRange)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.dates = result;
            });
        this.store
            .select(selectedEndpoint)
            .pipe(takeUntil(this.destroy$))
            .subscribe((endpoint) => {
                this.endpoint = endpoint;
                this.onViewGraph();
            });
        this.store
            .select(selectedParameters)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.selectedParameters = result;
            });
        this.store
            .select(triggerInfringementView)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                if (result > this.triggerInfringementViewCount) {
                    this.viewInfringements();
                    this.triggerInfringementViewCount = result;
                }
            });
        this.store
            .select(isComparisonLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.isComparisonLoading = result;
            });
        this.store
            .select(isGraphLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.isGraphLoading = result;
            });
    }

    showComparison(numberOfYears: number) {
        if (this.isComparisonLoading > 0) {
            return;
        }
        this.store.dispatch(showPreviousYearComparison({ data: false }));
        const yearsPrevious = Array(numberOfYears)
            .fill(0)
            .map((x, i) => i + 1);
        yearsPrevious.forEach((year) => {
            this.store.dispatch(loadComparison());
            const dto: DateRangeDto = {
                startDate: moment(this.dates.startDate).subtract(year, 'years').toISOString(),
                endDate: moment(this.dates.endDate).subtract(year, 'years').toISOString(),
            };
            this.graphingByStatusPageService
                .getGraphingByStatusPreviousYearData(dto, year, this.endpoint)
                .pipe(takeUntil(this.destroy$))
                .subscribe((result) => {
                    this.store.dispatch(resolveComparison());
                    if (!isNil(result)) {
                        if (this.isComparisonLoading <= 0) {
                            this.store.dispatch(showPreviousYearComparison({ data: true }));
                        }
                    }
                });
        });
    }

    onViewGraph() {
        if (this.isGraphLoading > 0) {
            return;
        }

        this.store.dispatch(loadGraph());
        this.graphingByStatusPageService
            .getGraphingByStatusData(this.dates, this.endpoint)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (!isEmpty(response)) {
                    this.showGraphs = true;
                    this.noAggregatedData = false;
                } else {
                    this.showGraphs = false;
                    this.noAggregatedData = true;
                }
                this.store.dispatch(resolveGraph());
            });
    }

    toggleInfringementCollapsed() {
        this.showInfringementsTable = false;
    }

    viewInfringements() {
        const tempParameters = { ...this.selectedParameters };

        // default start and end date to the selected date range if nothing is specified in the selected parameters
        if (!tempParameters.startDate) {
            tempParameters.startDate = this.dates.startDate;
        }
        if (!tempParameters.endDate) {
            tempParameters.endDate = this.dates.endDate;
        }
        this.store.dispatch(
            infringementNgrxHelper.setQueryParams({
                query: { graphing: true, ...tempParameters },
            }),
        );

        this.showInfringementsTable = true;
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetInfringementViewTrigger());
        this.store.dispatch(resetInfringementQueryParameters());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
