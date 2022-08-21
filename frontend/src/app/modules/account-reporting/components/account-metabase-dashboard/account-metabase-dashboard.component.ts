import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { Account } from '@modules/shared/models/entities/account.model';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { EMPTY, of, Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isNil } from 'lodash';
import { AccountService } from '@modules/account/services/account.service';
import { environment } from '@environment/environment';

@Component({
    selector: 'rp-account-metabase-dashboard',
    templateUrl: './account-metabase-dashboard.component.html',
    styleUrls: ['./account-metabase-dashboard.component.less'],
})
export class AccountMetabaseDashboardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    currentAccount: Account;
    currentAccountId: number;
    safeUrl: SafeResourceUrl;

    isDev = !environment.production;

    constructor(private store: Store<AppState>, private sanitizer: DomSanitizer, private accountService: AccountService) {}

    ngOnInit() {
        this.store
            .pipe(
                select(getSelectedAccount),
                mergeMap((result: { id: number; account: Account }) => {
                    this.currentAccountId = result.id;
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
            .subscribe((result) => {
                if (!isNil(result)) {
                    const account = result;
                    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(account.details.reportingEmbedUrl);
                    this.currentAccount = account;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
