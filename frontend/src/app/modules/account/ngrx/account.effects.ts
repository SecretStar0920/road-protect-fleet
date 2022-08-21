import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { AccountService } from '@modules/account/services/account.service';
import { accountNgrxHelper } from '@modules/account/ngrx/account.reducer';
import { LogService } from '@modules/log/services/log.service';

@Injectable()
export class AccountEffects {
    $onAccountCreation = createEffect(
        () =>
            this.actions$.pipe(
                ofType(accountNgrxHelper.addOne.type),
                tap(() => {
                    this.accountService.getAccountsForCurrentUser().subscribe();
                }),
            ),
        { dispatch: false },
    );

    triggerLogsRefresh = createEffect(() => {
        return this.actions$.pipe(
            ofType(accountNgrxHelper.updateOne),
            mergeMap((action) => {
                return this.logService.getLogsAndHistoryRefresh({ accountId: action.item.changes.accountId });
            }),
        );
    });

    constructor(
        private actions$: Actions,
        private router: Router,
        private auth: AuthService,
        private accountService: AccountService,
        private logService: LogService,
    ) {}
}
