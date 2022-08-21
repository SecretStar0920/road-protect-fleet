import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { takeUntil } from 'rxjs/operators';
import { selectAccount } from '@modules/account/ngrx/account.actions';
import { AppState } from '../../../../ngrx/app.reducer';
import { Subject } from 'rxjs';
import { getMetabaseKPIDetails } from '@modules/account-reporting/ngrx/account-reporting.actions';
import { getSelectedAccountId } from '@modules/account/ngrx/account.selectors';
import { metabaseKpiData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { IMetabaseItemDetails } from '@modules/shared/dtos/reporting-data.dto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'rp-account-reports-page',
    templateUrl: './account-reports-page.component.html',
    styleUrls: ['./account-reports-page.component.less'],
})
export class AccountReportsPageComponent implements OnInit, OnDestroy {
    reportDetails: IMetabaseItemDetails;
    private destroy$ = new Subject();
    constructor(private store: Store<AppState>, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.store.dispatch(selectAccount({ id: accountId }));
        });

        this.store.select(getSelectedAccountId).subscribe(() => this.onRefresh());

        // select data
        this.store.pipe(select(metabaseKpiData), takeUntil(this.destroy$)).subscribe((result) => {
            this.reportDetails = result[0];
        });
    }

    onRefresh() {
        this.store.dispatch(getMetabaseKPIDetails.request({ request: null }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    // https://filipmolcik.com/error-unsafe-value-used-in-a-resource-url-context/
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
