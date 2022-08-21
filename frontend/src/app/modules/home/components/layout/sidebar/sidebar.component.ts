import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserType } from '@modules/shared/models/entities/user.model';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccount } from '@modules/auth/ngrx/auth.reducer';
import { of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Account, AccountRole } from '@modules/shared/models/entities/account.model';
import { AccountService } from '@modules/account/services/account.service';
import { Dictionary, get, isEmpty, keyBy } from 'lodash';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { DataItem, SingleSeries } from '@swimlane/ngx-charts';
import { accountSummaryData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.less'],
})
export class SidebarComponent implements OnInit, OnDestroy {
    userTypes = UserType;
    accountRoles = AccountRole;
    permissions = PERMISSIONS;
    infringementStatus = InfringementStatus;
    private destroy$ = new Subject();

    currentAccount: Account;
    accountSummaryData: Dictionary<DataItem>;

    constructor(private store: Store<AuthState>, private accountService: AccountService) {}

    isCollapsed = false;

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    ngOnInit() {
        this.store
            .pipe(
                select(currentAccount),
                mergeMap((account) => {
                    if (isEmpty(account)) {
                        return this.accountService.getCurrentAccount();
                    } else {
                        return of(account);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((result) => {
                this.currentAccount = result;
                this.getAccountSummaryData();
            });
    }

    getAccountSummaryData() {
        this.store.pipe(select(accountSummaryData), takeUntil(this.destroy$)).subscribe((data: SingleSeries) => {
            this.accountSummaryData = keyBy(data, 'name');
        });
    }

    getCount(key: string) {
        if (get(this.accountSummaryData, key, false)) {
            return this.accountSummaryData[key].value;
        } else {
            return 0;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
