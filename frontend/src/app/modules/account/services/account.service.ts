import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { EMPTY, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { accountNgrxHelper, AccountState } from '@modules/account/ngrx/account.reducer';
import { plainToClass } from 'class-transformer';
import { CreateAccountV1Dto } from '@modules/account/services/create-account-v1.dto';
import { UpdateAccountV1Dto } from '@modules/account/services/update-account-v1.dto';
import { AuthService } from '@modules/auth/services/auth.service';
import { updateCurrentAccountAction, updateCurrentAvailableAccountsAction } from '@modules/auth/ngrx/auth.actions';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { IInfringementReportOutcome } from '@modules/account/components/email-account-infringement-report/email-account-infringement-report.component';
import { UpdateAccountV2Dto } from '@modules/account/services/update-account-v2.dto';
import { CreateAccountV2Dto } from '@modules/account/services/create-account-v2.dto';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private getAllAccountsState: ElementStateModel = new ElementStateModel<any>();
    private getAccountDropdownState: ElementStateModel = new ElementStateModel<any>();

    constructor(private http: HttpService, private store: Store<AccountState>, private authService: AuthService) {}

    getAllAccounts() {
        if (this.getAllAccountsState.isLoading()) {
            return EMPTY;
        }

        this.getAllAccountsState.submit();
        return this.http.getSecure('account').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Account, item));
                }
                return [];
            }),
            tap((accounts) => {
                this.getAllAccountsState.onSuccess();
                if (accounts.length && accounts.length >= 0) {
                    this.store.dispatch(accountNgrxHelper.load({ items: accounts }));
                }
            }),
        );
    }

    getAccountDropdownData() {
        if (this.getAccountDropdownState.isLoading()) {
            return EMPTY;
        }

        this.getAccountDropdownState.submit();
        return this.http.getSecure('account/dropdown').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Account, item));
                }
                return [];
            }),
            tap((accounts) => {
                this.getAccountDropdownState.onSuccess();
                if (accounts.length && accounts.length >= 0) {
                    this.store.dispatch(accountNgrxHelper.load({ items: accounts }));
                }
            }),
        );
    }

    getAccount(accountId: number) {
        if (!accountId) {
            return;
        }
        return this.http.getSecure(`account/${accountId}`).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((account) => {
                this.store.dispatch(accountNgrxHelper.upsertOne({ item: account }));
            }),
        );
    }

    getAccountByIdentity(identifier: string) {
        if (!identifier) {
            return;
        }
        return this.http.getSecure(`account/brn/${identifier}`).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((account: Account) => {
                if (account) {
                    this.store.dispatch(accountNgrxHelper.upsertOne({ item: account }));
                }
            }),
        );
    }

    getCurrentAccount() {
        return this.http.getSecure(`account/me`).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((account) => {
                this.store.dispatch(updateCurrentAccountAction({ account }));
            }),
        );
    }

    getAccountsForCurrentUser() {
        return this.http.getSecure(`account/me/all`).pipe(
            map((response: object[]) => {
                return plainToClass(Account, response);
            }),
            tap((accounts) => {
                this.store.dispatch(updateCurrentAvailableAccountsAction({ accounts }));
            }),
        );
    }

    createAccountV1(dto: CreateAccountV1Dto): Observable<Account> {
        return this.http.postSecure('account', dto).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((result) => {
                this.store.dispatch(accountNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    createAccountV2(dto: CreateAccountV2Dto): Observable<Account> {
        return this.http.postSecure('account/v2', dto).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((result) => {
                this.store.dispatch(accountNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateAccountV1(id: number, dto: UpdateAccountV1Dto): Observable<Account> {
        return this.http.postSecure(`account/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((result) => {
                this.store.dispatch(accountNgrxHelper.updateOne({ item: { id: result.accountId, changes: result } }));
            }),
        );
    }

    updateAccountV2(id: number, dto: UpdateAccountV2Dto): Observable<Account> {
        return this.http.postSecure(`account/v2/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((result) => {
                this.store.dispatch(accountNgrxHelper.updateOne({ item: { id: result.accountId, changes: result } }));
            }),
        );
    }

    deleteAccount(accountId: number) {
        return this.http.deleteSecure(`account/${accountId}`).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((account) => {
                this.store.dispatch(accountNgrxHelper.deleteOne({ id: `${account.accountId}` }));
            }),
        );
    }

    toggleAccountActive(accountId: number) {
        return this.http.deleteSecure(`account/${accountId}/soft`).pipe(
            map((response: object) => {
                return plainToClass(Account, response);
            }),
            tap((account) => {
                this.store.dispatch(accountNgrxHelper.updateOne({ item: { id: account.accountId, changes: account } }));
            }),
        );
    }
    sendAccountInfringementReport(accountId: number): Observable<IInfringementReportOutcome> {
        return this.http.post(`infringement-report/account`, { accountId });
    }
}
