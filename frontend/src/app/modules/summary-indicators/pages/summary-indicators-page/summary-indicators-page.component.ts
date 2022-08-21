import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { GetSummaryIndicatorsDto, SummaryIndicatorsService } from '@modules/summary-indicators/services/summary-indicators.service';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';
import { select, Store } from '@ngrx/store';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import {
    getComparisonAccountId,
    getComparisonDates,
    getThisYearAccountId,
} from '@modules/summary-indicators/ngrx/summary-indicators.selector';
import { AuthState, currentAccount } from '@modules/auth/ngrx/auth.reducer';
import { Account } from '@modules/shared/models/entities/account.model';
import { NGXLogger } from 'ngx-logger';
import {
    clearSummaryIndicatorsData,
    requestComparisonSummaryIndicators,
    requestThisYearSummaryIndicators,
    updateDateComparison,
} from '@modules/summary-indicators/ngrx/summary-indicators.actions';

@Component({
    selector: 'rp-summary-indicators-page',
    templateUrl: './summary-indicators-page.component.html',
    styleUrls: ['./summary-indicators-page.component.less'],
})
export class SummaryIndicatorsPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    isLoading: boolean = false;
    defaultDateRange: SliderDateRangeDto;
    currentAccount: Account;
    currentSelectedDates: SliderDateRangeDto;

    constructor(
        private summaryIndicatorsService: SummaryIndicatorsService,
        private store: Store<SummaryIndicatorsState>,
        private authStore: Store<AuthState>,
        private logger: NGXLogger,
    ) {}

    ngOnInit() {
        this.authStore.pipe(select(currentAccount), takeUntil(this.destroy$)).subscribe((result) => {
            this.currentAccount = result;
        });
        this.defaultDateRange = {
            startDate: moment().startOf('year').toISOString(),
            endDate: moment().endOf('year').toISOString(),
        };
        this.onChangeYears();
    }

    getSummaryIndicators(dateRange?: SliderDateRangeDto) {
        this.store.dispatch(updateDateComparison({ isDateComparison: !!dateRange }));
        // Only query if the account or date range has changed
        let storeThisYearAccountId: number;
        let storeComparisonAccountId: number;
        let storeDates: SliderDateRangeDto;
        this.store
            .pipe(select(getThisYearAccountId), takeUntil(this.destroy$))
            .subscribe((accountId) => (storeThisYearAccountId = accountId));
        this.store
            .pipe(select(getComparisonAccountId), takeUntil(this.destroy$))
            .subscribe((accountId) => (storeComparisonAccountId = accountId));
        this.store.pipe(select(getComparisonDates), takeUntil(this.destroy$)).subscribe((date) => (storeDates = date));
        // Check if changed accounts
        if (this.currentAccount.accountId !== storeThisYearAccountId || this.currentAccount.accountId !== storeComparisonAccountId) {
            this.store.dispatch(clearSummaryIndicatorsData());
            this.onChangeYears(dateRange);
        } else {
            // Check if changed dates
            if (!!dateRange) {
                // Comparing Dates
                if (this.newDates(storeDates, dateRange)) {
                    // Date Range has changed
                    this.onChangeYears(dateRange);
                }
            }
        }
    }

    newDates(storeDates: SliderDateRangeDto, dates: SliderDateRangeDto): boolean {
        if (!storeDates) {
            return true;
        }
        return !(moment(storeDates.startDate).isSame(moment(dates.startDate)) && moment(storeDates.endDate).isSame(moment(dates.endDate)));
    }

    onChangeYears(dateRange?: SliderDateRangeDto) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const dates: SliderDateRangeDto = dateRange ? dateRange : this.defaultDateRange;
        const isDateComparison: boolean = !!dateRange; // if there is no date range, it will be the default range which does not compare
        const dto: GetSummaryIndicatorsDto = {
            dateRange: dates,
            isDateComparison,
        };
        if (isDateComparison) {
            this.logger.debug('Querying for comparison summary indicators.');
            this.store.dispatch(requestComparisonSummaryIndicators.request({ request: dto }));
        } else {
            this.logger.debug('Querying for this years summary indicators.');
            this.store.dispatch(requestThisYearSummaryIndicators.request({ request: dto }));
        }
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
