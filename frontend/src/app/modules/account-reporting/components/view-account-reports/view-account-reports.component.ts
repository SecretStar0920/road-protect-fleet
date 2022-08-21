import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { select, Store } from '@ngrx/store';
import {
    getAccountSummary,
    getInfringementAmounts,
    getInfringementCounts,
    getLeadingVehicles,
    getMetabaseItemDetails,
    getVehicleCounts,
} from '@modules/account-reporting/ngrx/account-reporting.actions';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { accountReportingLoading } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-view-account-reports',
    templateUrl: './view-account-reports.component.html',
    styleUrls: ['./view-account-reports.component.less'],
})
export class ViewAccountReportsComponent implements OnInit, OnDestroy {
    permissions = PERMISSIONS;

    private destroy$ = new Subject();
    isLoading: Observable<boolean> = this.store.pipe(select(accountReportingLoading), takeUntil(this.destroy$));

    constructor(private store: Store<AccountReportingState>) {}

    ngOnInit() {
        // this.store.select(getSelectedAccountId).subscribe(() => this.onRefresh());
    }

    onRefresh() {
        this.store.dispatch(getVehicleCounts.request({ request: null }));
        this.store.dispatch(getAccountSummary.request({ request: null }));
        this.store.dispatch(getInfringementCounts.request({ request: null }));
        this.store.dispatch(getInfringementAmounts.request({ request: null }));
        this.store.dispatch(getLeadingVehicles.request({ request: null }));
        this.store.dispatch(getMetabaseItemDetails.request({ request: null }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
