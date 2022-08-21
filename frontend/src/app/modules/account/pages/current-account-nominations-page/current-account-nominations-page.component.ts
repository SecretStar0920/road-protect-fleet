import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAccount } from '@modules/account/ngrx/account.actions';

@Component({
    selector: 'rp-current-account-nominations-page',
    templateUrl: './current-account-nominations-page.component.html',
    styleUrls: ['./current-account-nominations-page.component.less'],
})
export class CurrentAccountNominationsPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();

    accountId: number;

    constructor(private store: Store<AuthState>) {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.store.dispatch(selectAccount({ id: accountId }));
            this.accountId = accountId;
        });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
