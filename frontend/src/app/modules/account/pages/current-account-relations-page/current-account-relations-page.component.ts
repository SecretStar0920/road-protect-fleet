import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAccount } from '@modules/account/ngrx/account.actions';

@Component({
    selector: 'rp-current-account-relations-page',
    templateUrl: './current-account-relations-page.component.html',
    styleUrls: ['./current-account-relations-page.component.less'],
})
export class CurrentAccountRelationsPageComponent implements OnInit, OnDestroy {
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
        // this.store.dispatch(actions.upda({ mine: true, via: 'nominated' }));
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
