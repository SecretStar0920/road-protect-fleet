import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { accountUserNgrxHelper, AccountUserState } from '@modules/account-user/ngrx/account-user.reducer';
import { plainToClass } from 'class-transformer';
import { CreateAccountUserDto } from '@modules/account-user/services/create-account-user.dto';
import { UpdateAccountUserDto } from '@modules/account-user/services/update-account-user.dto';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Injectable({
    providedIn: 'root',
})
export class AccountUserService {
    private getCurrentAccountUserState: ElementStateModel = new ElementStateModel<any>();

    constructor(private http: HttpService, private store: Store<AccountUserState>) {}

    getAllAccountUsers() {
        return this.http.getSecure('account-user').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountUser, item));
                }
                return [];
            }),
            tap((accountUsers) => {
                this.store.dispatch(accountUserNgrxHelper.load({ items: accountUsers }));
            }),
        );
    }

    getAccountUsersForAccount(accountId: number) {
        return this.http.getSecure(`account-user/account/${accountId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountUser, item));
                }
                return [];
            }),
            tap((accountUsers) => {
                this.store.dispatch(accountUserNgrxHelper.addMany({ items: accountUsers }));
            }),
        );
    }

    getAccountUser(accountUserId: number) {
        return this.http.getSecure(`account-user/${accountUserId}`).pipe(
            map((response: object) => {
                return plainToClass(AccountUser, response);
            }),
            tap((accountUser) => {
                this.store.dispatch(accountUserNgrxHelper.addOne({ item: accountUser }));
            }),
        );
    }

    /**
     *   FIXME: dirty hack here to prevent hasRole.directive from simultaneously requesting the user many times
     *   @link HasRoleDirective#constructor
     */
    getCurrentAccountUser() {
        if (this.getCurrentAccountUserState.isLoading()) {
            return of(null);
        }
        this.getCurrentAccountUserState.submit();
        return this.http.getSecure(`account-user/me`).pipe(
            map((response: object) => {
                return plainToClass(AccountUser, response);
            }),
            tap((accountUser) => {
                this.getCurrentAccountUserState.onSuccess();
                this.store.dispatch(accountUserNgrxHelper.addOne({ item: accountUser }));
            }),
        );
    }

    createAccountUser(dto: CreateAccountUserDto): Observable<AccountUser> {
        const submitDto = dto;
        if (typeof dto.roleNames === 'string') {
            submitDto.roleNames = [dto.roleNames];
        }
        return this.http.postSecure('account-user', submitDto).pipe(
            map((response: object) => {
                return plainToClass(AccountUser, response);
            }),
            tap((result) => {
                this.store.dispatch(accountUserNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateAccountUser(id: number, dto: UpdateAccountUserDto): Observable<AccountUser> {
        const submitDto = dto;
        if (typeof dto.roleNames === 'string') {
            submitDto.roleNames = [dto.roleNames];
        }
        return this.http.postSecure(`account-user/${id}`, submitDto).pipe(
            map((response: object) => {
                return plainToClass(AccountUser, response);
            }),
            tap((result: AccountUser) => {
                this.store.dispatch(accountUserNgrxHelper.updateOne({ item: { id: result.accountUserId, changes: result } }));
            }),
        );
    }

    deleteAccountUser(accountUserId: number) {
        return this.http.deleteSecure(`account-user/${accountUserId}`).pipe(
            map((response: object) => {
                return plainToClass(AccountUser, response);
            }),
            tap((accountUser) => {
                this.store.dispatch(accountUserNgrxHelper.deleteOne({ id: `${accountUser.accountUserId}` }));
            }),
        );
    }
}
