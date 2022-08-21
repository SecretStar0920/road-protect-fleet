import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { changeAccountAction, loginAction, logoutAction, logoutCompleteAction } from '@modules/auth/ngrx/auth.actions';
import { exhaustMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { User } from '@modules/shared/models/entities/user.model';
import { defer, from, Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { AccountService } from '@modules/account/services/account.service';
import { RoleService } from '@modules/role/services/role.service';
import { Action } from '@ngrx/store';

@Injectable()
export class AuthEffects {
    $onLogin = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loginAction),
                tap((result) => {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    localStorage.setItem('accountUserId', JSON.stringify(result.accountUserId));
                    localStorage.setItem('accountId', JSON.stringify(result.accountId));
                    localStorage.setItem('idToken', result.token);

                    this.roleService.getCurrentPermissions().subscribe();
                }),
            ),
        { dispatch: false },
    );

    $onChangeAccount = createEffect(
        () =>
            this.actions$.pipe(
                ofType(changeAccountAction),
                tap((result) => {
                    localStorage.setItem('accountUserId', JSON.stringify(result.accountUserId));
                    localStorage.setItem('accountId', JSON.stringify(result.accountId));
                    localStorage.setItem('idToken', result.token);

                    this.router.navigate(['home', 'account', 'loading']);

                    // Refresh current account
                    this.accountService.getCurrentAccount().subscribe();
                    this.roleService.getCurrentPermissions().subscribe();
                }),
            ),
        { dispatch: false },
    );

    $onLogout = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutAction),
            exhaustMap(() => {
                localStorage.removeItem('idToken');
                localStorage.removeItem('user');
                localStorage.removeItem('accountUserId');
                localStorage.removeItem('accountId');
                return from(
                    new Promise((resolve, reject) => {
                        this.router.navigate(['/login']).then(() => {
                            resolve(logoutCompleteAction());
                        });
                    }),
                ) as Observable<Action>;
            }),
        ),
    );

    $init = createEffect(() =>
        defer(() => {
            const userString = localStorage.getItem('user');
            const tokenString = localStorage.getItem('idToken');
            const accountUserIdString = localStorage.getItem('accountUserId');
            const accountIdString = localStorage.getItem('accountId');
            if (userString && tokenString && accountUserIdString && accountIdString) {
                const user = plainToClass(User, JSON.parse(userString) as object);
                const accountUserId = Number(accountUserIdString);
                const accountId = Number(accountIdString);
                return of(loginAction({ user, token: tokenString, accountUserId, accountId }));
            }
            // return of(new LogoutAction());
        }),
    );

    constructor(
        private actions$: Actions,
        private router: Router,
        private auth: AuthService,
        private accountService: AccountService,
        private roleService: RoleService,
    ) {}
}
