import { Component, OnDestroy, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { EMPTY, of, Subject } from 'rxjs';
import { Account } from '@modules/shared/models/entities/account.model';
import { AccountService } from '@modules/account/services/account.service';
import { isNil } from 'lodash';
import { contractNgrxHelper } from '@modules/contract/ngrx/contract.reducer';

@Component({
    selector: 'rp-view-account-contracts',
    templateUrl: './view-account-contracts.component.html',
    styleUrls: ['./view-account-contracts.component.less'],
})
export class ViewAccountContractsComponent implements OnInit, OnDestroy {
    accountId: number;
    account: Account;

    showAll: boolean = false;
    show: { fleet: boolean; owned: boolean } = {
        fleet: false,
        owned: false,
    };
    private destroy$ = new Subject();

    constructor(
        private logger: NGXLogger,
        private modalService: NzModalService,
        private router: Router,
        private store: Store<AppState>,
        private accountService: AccountService,
    ) {}

    ngOnInit() {
        this.store
            .pipe(
                select(getSelectedAccount),
                mergeMap((result: { id: number; account: Account }) => {
                    this.accountId = result.id;
                    if (isNil(result.account)) {
                        if (result.id) {
                            return this.accountService.getAccount(result.id);
                        } else {
                            return EMPTY;
                        }
                    } else {
                        return of(result.account);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((account) => {
                this.account = account;
            });

        this.store.dispatch(contractNgrxHelper.setQueryParams({ query: { mine: true } }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
