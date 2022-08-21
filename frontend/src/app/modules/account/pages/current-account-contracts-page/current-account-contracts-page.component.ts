import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAccount } from '@modules/account/ngrx/account.actions';

@Component({
    selector: 'rp-current-account-contracts-page',
    templateUrl: './current-account-contracts-page.component.html',
    styleUrls: ['./current-account-contracts-page.component.less'],
})
export class CurrentAccountContractsPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();

    constructor(private store: Store<AuthState>) {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.store.dispatch(selectAccount({ id: accountId }));
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
