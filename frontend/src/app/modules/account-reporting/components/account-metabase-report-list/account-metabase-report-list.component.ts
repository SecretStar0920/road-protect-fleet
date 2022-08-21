import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountReportingService } from '@modules/account-reporting/services/account-reporting.service';
import { getMetabaseItemDetails } from '@modules/account-reporting/ngrx/account-reporting.actions';
import { getSelectedAccountId } from '@modules/account/ngrx/account.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { Observable, Subject } from 'rxjs';
import { accountReportingLoading, metabaseItemsData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import { MetabaseItemDetailsArray } from '@modules/shared/dtos/reporting-data.dto';

@Component({
    selector: 'rp-account-metabase-report-list',
    templateUrl: './account-metabase-report-list.component.html',
    styleUrls: ['./account-metabase-report-list.component.less'],
})
export class AccountMetabaseReportListComponent implements OnInit, OnDestroy {
    metabaseItems: MetabaseItemDetailsArray;
    noItems: boolean = true;

    private destroy$ = new Subject();
    isLoading: Observable<boolean> = this.store.pipe(select(accountReportingLoading), takeUntil(this.destroy$));

    constructor(private accountReportingService: AccountReportingService, private store: Store<AppState>) {}

    ngOnInit() {
        this.store.select(getSelectedAccountId).subscribe(() => this.onRefresh());

        // select data
        this.store.pipe(select(metabaseItemsData), takeUntil(this.destroy$)).subscribe((result) => {
            this.metabaseItems = result;
            this.noItems = this.metabaseItems.length === 0;
        });
    }

    onRefresh() {
        this.store.dispatch(getMetabaseItemDetails.request({ request: null }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
