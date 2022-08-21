import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Account } from '@modules/shared/models/entities/account.model';
import { select, Store } from '@ngrx/store';
import * as accountSelectors from '@modules/account/ngrx/account.selectors';
import { takeUntil, tap } from 'rxjs/operators';
import { AccountState } from '@modules/account/ngrx/account.reducer';
import { AccountService } from '@modules/account/services/account.service';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-brn-account-tag',
    templateUrl: './brn-account-tag.component.html',
    styleUrls: ['./brn-account-tag.component.less'],
})
export class BrnAccountTagComponent implements OnInit, OnDestroy {
    @Input() brn: string;
    brnAccount: Account; // The account that has the infringement's BRN as its identifier
    private destroy$ = new Subject();

    constructor(private accountStore: Store<AccountState>, private logger: NGXLogger, private accountService: AccountService) {}

    ngOnInit() {
        this.accountStore
            .pipe(
                select(accountSelectors.getAccountByIdentifier(this.brn)),
                takeUntil(this.destroy$),
                tap((account) => {
                    if (!account || account.length < 1) {
                        this.logger.debug('Account not found on store, querying for it');
                        this.accountService.getAccountByIdentity(this.brn).subscribe();
                    }
                }),
            )
            .subscribe(
                (result) => {
                    this.brnAccount = result[0];
                },
                (error) => {
                    this.logger.debug('Account does not exist', error);
                },
            );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
