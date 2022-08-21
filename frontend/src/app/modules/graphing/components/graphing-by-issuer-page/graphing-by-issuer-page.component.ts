import { Component, OnDestroy, OnInit } from '@angular/core';
import { GraphingByIssuerPageService } from '@modules/graphing/services/graphing-by-issuer-page.service';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import {
    graphingByIssuerNumber,
    GraphingParameters,
    graphingSelectedParameters,
    loadComparison,
    loadGraph,
    resetComparisonLoad,
    resetGraphLoad,
    resetInfringementViewTrigger,
    resolveComparison,
    resolveGraph,
    setShowOther,
    showPreviousYearComparison,
} from '@modules/graphing/ngrx/graphing.actions';
import { isEmpty, isNil } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import {
    byIssuerUniqueKeys,
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
    selector: 'rp-graphing-by-issuer-page',
    templateUrl: './graphing-by-issuer-page.component.html',
    styleUrls: ['./graphing-by-issuer-page.component.less'],
})
export class GraphingByIssuerPageComponent implements OnInit, OnDestroy {
    showGraphs: boolean = false;
    isComparisonLoading: number;
    isGraphLoading: number;
    showOthers: boolean = false;
    selectedParameters: GraphingParameters;
    endpoint: ReportingEndpoints;
    viaQueryParams: string;
    private destroy$ = new Subject();
    triggerInfringementViewCount: number = 0;
    dates: DateRangeDto;
    showInfringementsTable: boolean = false;
    totalUniqueIssuers: number = 0;

    private _graphDisplay: string = 'bar-graph';
    noAggregatedData: boolean = false;
    get graphDisplay(): string {
        return this._graphDisplay;
    }

    set graphDisplay(value: string) {
        this._graphDisplay = value;
    }

    groupedIssuers: number;
    groupedIssuersSliderRange: { min: number; max: number };
    defaultNumberOfIssuers: number = 10;
    minNumberOfIssuers: number = 5;

    showLineGraph(): boolean {
        return this.graphDisplay === 'line-graph';
    }

    showBarGraph(): boolean {
        return this.graphDisplay === 'bar-graph';
    }

    constructor(private graphingByIssuerPageService: GraphingByIssuerPageService, private store: Store<GraphingState>) {
        // Setup slider ranges
        this.groupedIssuersSliderRange = { min: undefined, max: undefined };
    }

    ngOnInit() {
        this.store
            .select(dateRange)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.dates = result;
            });
        this.store
            .select(byIssuerUniqueKeys)
            .pipe(takeUntil(this.destroy$))
            .subscribe((accountNumberOfIssuers) => {
                if (!accountNumberOfIssuers) {
                    return;
                }

                this.totalUniqueIssuers = accountNumberOfIssuers

                if (accountNumberOfIssuers === 1) {
                    // There is only one Issuer
                    this.groupedIssuersSliderRange.min = accountNumberOfIssuers;
                    this.groupedIssuers = accountNumberOfIssuers;
                    this.groupedIssuersSliderRange.max = this.defaultNumberOfIssuers;
                } else {
                    this.groupedIssuersSliderRange.min = accountNumberOfIssuers < this.minNumberOfIssuers ? 1 : this.minNumberOfIssuers;
                    this.groupedIssuersSliderRange.max =
                        accountNumberOfIssuers < this.minNumberOfIssuers ? this.minNumberOfIssuers : accountNumberOfIssuers;
                    this.groupedIssuers =
                        accountNumberOfIssuers < this.minNumberOfIssuers && this.defaultNumberOfIssuers < accountNumberOfIssuers
                            ? this.defaultNumberOfIssuers
                            : accountNumberOfIssuers;

                }


                setTimeout(() => this.onChangeIssuerNumber())
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
        this.store
            .select(selectedEndpoint)
            .pipe(takeUntil(this.destroy$))
            .subscribe((endpoint) => {
                this.endpoint = endpoint;
                if (endpoint === ReportingEndpoints.Owner) {
                    this.viaQueryParams = 'vehicleOwner';
                } else if (endpoint === ReportingEndpoints.User) {
                    this.viaQueryParams = 'vehicleUser';
                } else {
                    // All has been selected
                }
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
                } else {
                    this.showInfringementsTable = false;
                }
            });
    }

    onChangeShowOthers() {
        this.store.dispatch(setShowOther({ showOther: this.showOthers }));
    }

    onChangeIssuerNumber() {
        this.store.dispatch(graphingByIssuerNumber({ groupedIssuers: this.groupedIssuers }));
    }

    onViewGraph() {
        if (!this.endpoint) {
            return;
        }
        this.store.dispatch(loadGraph());
        this.store.dispatch(showPreviousYearComparison({ data: false }));

        const queryParams: GraphingParameters = {
            vehicleRegistration: null,
            graphing: true,
            startDate: this.dates?.startDate,
            endDate: this.dates?.endDate,
            issuers: [],
            via: this.viaQueryParams || 'withBRN',
            mine: true,
            infringementStatus: null,
        };
        this.store.dispatch(
            infringementNgrxHelper.setQueryParams({
                query: queryParams,
            }),
        );
        const queryParameters: GraphingParameters = undefined;
        this.store.dispatch(graphingSelectedParameters({ data: queryParameters }));
        this.graphingByIssuerPageService
            .getGraphingByIssuerData(this.dates, this.endpoint)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                if (!isEmpty(response)) {
                    this.showGraphs = true;
                    this.noAggregatedData = false;
                } else {
                    this.noAggregatedData = true;
                    this.showGraphs = false;
                }
                this.store.dispatch(resolveGraph());
            });
    }

    showComparison(numberOfYears: number) {
        if (!this.endpoint) {
            return;
        }
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
            this.graphingByIssuerPageService
                .getGraphingByIssuerPreviousYearData(dto, year, this.endpoint)
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

    toggleInfringementCollapsed() {
        this.showInfringementsTable = false;
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetInfringementViewTrigger());
        this.store.dispatch(resetInfringementQueryParameters());
        this.store.dispatch(resetComparisonLoad());
        this.store.dispatch(resetGraphLoad());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    viewInfringements() {
        const tempParameters = { ...this.selectedParameters };

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
}
