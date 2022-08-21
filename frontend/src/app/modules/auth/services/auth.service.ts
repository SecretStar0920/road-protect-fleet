import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { User } from '@modules/shared/models/entities/user.model';
import { AuthState } from '@modules/auth/ngrx/auth.reducer';
import { Store } from '@ngrx/store';
import { changeAccountAction, loginAction, logoutAction, updateCurrentUserAction } from '@modules/auth/ngrx/auth.actions';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpService, private store: Store<AuthState>, private router: Router) {}

    login(email: string, password: string, recaptchaKey: string): Observable<User> {
        password = crypto.SHA512(password).toString();
        return this.http.postSecure('auth/login', { email, password, recaptchaKey }).pipe(
            map((response) => {
                return {
                    ...response,
                    user: plainToClass(User, response.user),
                    accountUserId: response.accountUserId,
                    accountId: response.accountId,
                };
            }),
            tap((response) => {
                this.store.dispatch(
                    loginAction({
                        user: response.user,
                        token: response.token,
                        accountUserId: response.accountUserId,
                        accountId: response.accountId,
                    }),
                );
                // const accountUsers = response.user.accounts;
                // const accounts = accountUsers.map(account => account.account);
            }),
        );
    }

    completeSignup(isComplete: boolean) {
        return this.http.postSecure('auth/complete-signup', { isComplete });
    }

    changePassword(password: string, email?: string): Observable<null> {
        password = crypto.SHA512(password).toString();
        return this.http.postSecure('auth/change-password', { newPassword: password, email });
    }

    forgotPassword(email: string): Observable<null> {
        return this.http.postSecure('auth/forgot-password/request', { email });
    }

    forgotPasswordConfirm(password: string, jwt: string): Observable<null> {
        password = crypto.SHA512(password).toString();
        return this.http.postSecure('auth/forgot-password/confirm', { newPassword: password, jwt });
    }

    logout() {
        this.store.dispatch(logoutAction());
    }

    changeAccount(accountId: number) {
        return this.http.postSecure(`auth/change-account/${accountId}`, {}).pipe(
            tap((response) => {
                this.store.dispatch(
                    changeAccountAction({
                        accountUserId: response.accountUserId,
                        accountId: response.accountId,
                        token: response.token,
                    }),
                );
            }),
        );
    }

    getMe() {
        return this.http.getSecure(`auth/me`).pipe(
            map((response: object) => {
                return plainToClass(User, response);
            }),
            tap((user: User) => {
                this.store.dispatch(
                    updateCurrentUserAction({
                        user: plainToClass(User, user),
                    }),
                );
            }),
        );
    }
}
