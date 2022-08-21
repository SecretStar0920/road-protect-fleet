import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { of, Subject } from 'rxjs';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { LayoutService } from '@modules/home/services/layout.service';
import { select, Store } from '@ngrx/store';
import { AuthState, availableAccounts, currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { AuthService } from '@modules/auth/services/auth.service';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { isEmpty } from 'lodash';
import { AccountService } from '@modules/account/services/account.service';
import i18next from 'i18next';

@Component({
    selector: 'rp-change-current-account',
    templateUrl: './change-current-account.component.html',
    styleUrls: ['./change-current-account.component.less'],
})
export class ChangeCurrentAccountComponent implements OnInit, OnDestroy {
    accountId: number;
    availableAccounts: Account[];
    private destroy$ = new Subject();

    changeAccountState: ElementStateModel = new ElementStateModel();

    @Output() changeAccountComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
    changeAccountVisible: boolean;

    constructor(
        public layout: LayoutService,
        private store: Store<AuthState>,
        private authService: AuthService,
        private accountService: AccountService,
    ) {}

    ngOnInit() {
        this.store
            .pipe(
                select(availableAccounts),
                mergeMap((accounts) => {
                    if (isEmpty(accounts)) {
                        this.accountService.getAccountsForCurrentUser().subscribe();
                    }
                    return of(accounts);
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((accounts) => {
                this.availableAccounts = accounts;
            });

        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((account) => {
            this.accountId = account;
        });
    }

    onChangeAccount(accountId: number) {
        this.changeAccountState.submit();
        this.authService.changeAccount(accountId).subscribe(
            (result) => {
                this.changeAccountState.onSuccess(i18next.t('change-current-account.success'), result);
                this.changeAccountVisible = false;
                this.changeAccountComplete.emit(true);
            },
            (error) => {
                this.changeAccountState.onFailure(i18next.t('change-current-account.fail'), error);
                this.changeAccountVisible = true;
                this.changeAccountComplete.emit(false);
            },
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
