import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { takeUntil } from 'rxjs/operators';
import { isEmpty, isNil } from 'lodash';
import { Subject } from 'rxjs';
import { GraphingByVehiclePageService } from '@modules/graphing/services/graphing-by-vehicle-page.service';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import {
    graphingByVehicleNumber,
    GraphingParameters,
    loadComparison,
    loadGraph,
    resetInfringementViewTrigger,
    resolveComparison,
    resolveGraph,
    showPreviousYearComparison,
} from '@modules/graphing/ngrx/graphing.actions';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import {
    byVehicleUniqueKeys,
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
    selector: 'rp-graphing-by-vehicle-page',
    templateUrl: './graphing-by-vehicle-page.component.html',
    styleUrls: ['./graphing-by-vehicle-page.component.less'],
})
export class GraphingByVehiclePageComponent implements OnInit, OnDestroy {
    endpoint: ReportingEndpoints;
    viaQueryParams: string;
    private destroy$ = new Subject();
    showGraphs: boolean = false;
    noAggregatedData: boolean = false;
    selectedParameters: GraphingParameters;
    triggerInfringementViewCount: number = 0;
    isComparisonLoading: number;
    isGraphLoading: number;
    dates: DateRangeDto;
    showInfringementsTable: boolean = false;

    numberOfVehicles: number;
    defaultNumberOfVehicles: number = 10;
    maxNumberOfVehicles: number = 45;
    minNumberOfVehicles: number = 5;
    defaultVehicleSliderStep: number = 5;
    vehicleSliderStep: number;
    numberOfVehiclesSliderRange: { min: number; max: number };

    constructor(private graphingByVehiclePageService: GraphingByVehiclePageService, private store: Store<GraphingState>) {
        this.numberOfVehiclesSliderRange = { min: undefined, max: undefined };
    }

    ngOnInit(): void {
        this.store
            .select(dateRange)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.dates = result;
            });
        this.store
            .select(byVehicleUniqueKeys)
            .pipe(takeUntil(this.destroy$))
            .subscribe((accountNumberOfVehicles) => {
                if (!accountNumberOfVehicles) {
                    return;
                }
                if (accountNumberOfVehicles === 1) {
                    // There is only one vehicle
                    this.numberOfVehiclesSliderRange.min = accountNumberOfVehicles;
                    this.vehicleSliderStep = accountNumberOfVehicles;
                    this.numberOfVehicles = accountNumberOfVehicles;
                    this.numberOfVehiclesSliderRange.max = this.defaultNumberOfVehicles;
                    return;
                }
                this.numberOfVehiclesSliderRange.min = accountNumberOfVehicles < this.minNumberOfVehicles ? 1 : this.minNumberOfVehicles;
                this.vehicleSliderStep = accountNumberOfVehicles < this.minNumberOfVehicles ? 1 : this.defaultVehicleSliderStep;
                this.numberOfVehicles = accountNumberOfVehicles < this.minNumberOfVehicles ? 1 : this.defaultNumberOfVehicles;
                this.numberOfVehiclesSliderRange.max =
                    accountNumberOfVehicles < this.maxNumberOfVehicles ? accountNumberOfVehicles : this.maxNumberOfVehicles;
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

    onViewGraph() {
        if (this.isGraphLoading > 0) {
            return;
        }
        this.store.dispatch(loadGraph());
        // Make request to backend here
        const queryParams: GraphingParameters = {
            graphing: true,
            startDate: this.dates.startDate,
            endDate: this.dates.endDate,
            issuers: [],
            vehicleRegistration: null,
            infringementStatus: null,
            via: this.viaQueryParams || 'withBRN',
            mine: true,
        };
        this.store.dispatch(
            infringementNgrxHelper.setQueryParams({
                query: queryParams,
            }),
        );
        this.graphingByVehiclePageService
            .getGraphingByVehicleData(this.dates, this.endpoint)
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

    toggleInfringementCollapsed() {
        this.showInfringementsTable = false;
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetInfringementViewTrigger());
        this.store.dispatch(resetInfringementQueryParameters());
        this.destroy$.next();
        this.destroy$.unsubscribe();
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
            this.graphingByVehiclePageService
                .getGraphingByVehiclePreviousYearData(dto, year, this.endpoint)
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

    onChangeVehicleNumber() {
        this.store.dispatch(graphingByVehicleNumber({ groupedVehicles: this.numberOfVehicles }));
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
}
