import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import {
    getInfringementTableShowing,
    getIsDateComparison,
    getThisYearData,
    getYearComparisonData,
    summaryIndicatorLoading,
} from '@modules/summary-indicators/ngrx/summary-indicators.selector';
import { takeUntil } from 'rxjs/operators';
import {
    ComparisonSummaryIndicatorData,
    ThisYearSummaryIndicatorData,
} from '@modules/summary-indicators/services/summary-indicators.service';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { hideInfringementView, SummaryIndicatorTypes } from '@modules/summary-indicators/ngrx/summary-indicators.actions';

@Component({
    selector: 'rp-summary-indicators',
    templateUrl: './summary-indicators.component.html',
    styleUrls: ['./summary-indicators.component.less'],
})
export class SummaryIndicatorsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    isComparingDates: boolean = false;
    thisYearManipulatedData: ThisYearSummaryIndicatorData;
    comparisonManipulatedData: ComparisonSummaryIndicatorData;
    isLoading: Observable<boolean> = this.store.pipe(select(summaryIndicatorLoading), takeUntil(this.destroy$));
    showInfringementTable: boolean = false;
    filterVisibility = FilterKeyVisibility.None;
    infringementTableData: SummaryIndicatorTypes = SummaryIndicatorTypes.None;
    summaryIndicatorTypes = SummaryIndicatorTypes;
    constructor(private store: Store<SummaryIndicatorsState>) {}

    ngOnInit() {
        this.store.pipe(select(getIsDateComparison), takeUntil(this.destroy$)).subscribe((result) => {
            if (result !== this.isComparingDates) {
                this.isComparingDates = result;
                this.store.dispatch(hideInfringementView());
            }
        });
        this.store
            .pipe(select(getYearComparisonData), takeUntil(this.destroy$))
            .subscribe((result) => (this.comparisonManipulatedData = result));
        this.store.pipe(select(getThisYearData), takeUntil(this.destroy$)).subscribe((result) => (this.thisYearManipulatedData = result));
        this.store
            .pipe(select(getInfringementTableShowing), takeUntil(this.destroy$))
            .subscribe((result) => (this.infringementTableData = result));
    }

    toggleInfringementCollapsed() {
        this.store.dispatch(hideInfringementView());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
