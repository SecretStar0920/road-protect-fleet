import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAccount } from '@modules/account/ngrx/account.actions';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';

@Component({
    selector: 'rp-current-account-infringements-page',
    templateUrl: './current-account-infringements-page.component.html',
    styleUrls: ['./current-account-infringements-page.component.less'],
})
export class CurrentAccountInfringementsPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();

    accountId: number;

    constructor(private store: Store<AuthState>) {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.store.dispatch(selectAccount({ id: accountId }));
            this.updateQueryParams();
            this.accountId = accountId;
        });
    }

    private updateQueryParams() {
        this.store.dispatch(infringementNgrxHelper.setQueryParams({ query: { mine: true, via: 'ownerInfringements' } }));
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
