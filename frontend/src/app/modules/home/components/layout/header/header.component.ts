import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '@modules/home/services/layout.service';
import { AuthState, currentAccount, currentAccountId, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { select, Store } from '@ngrx/store';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '@modules/auth/services/auth.service';
import i18next from 'i18next';
import * as ct from 'countries-and-timezones';
import { Country } from 'countries-and-timezones';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { AccountService } from '@modules/account/services/account.service';
import { Account } from '@modules/shared/models/entities/account.model';
import { selectAccount } from '@modules/account/ngrx/account.actions';

@Component({
    selector: 'rp-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    user: User;
    currentAccount: Account;
    userTypes = UserType;
    private destroy$ = new Subject();

    public dir: string = 'ltr';

    private _selectedLanguage: string = i18next.language;
    get selectedLanguage(): string {
        return this._selectedLanguage;
    }

    set selectedLanguage(value: string) {
        this._selectedLanguage = value;
        this.onSwitchLang();
    }

    countries: Country[] = [ct.getCountry('IL'), ct.getCountry('ZA')];
    private _selectedCountry: string;
    get selectedCountry(): string {
        return this._selectedCountry;
    }

    set selectedCountry(value: string) {
        this._selectedCountry = value;
        const country: Country = ct.getCountry(value);
        this.cookieService.set('timezone', country.timezones[0], null, '/');
        this.cookieService.set('country', country.id, null, '/');
    }

    constructor(
        public layout: LayoutService,
        private store: Store<AuthState>,
        private authService: AuthService,
        private cookieService: CookieService,
        private router: Router,
        private accountService: AccountService,
    ) {
        this.dir = i18next.dir(i18next.language);
        this._selectedLanguage = i18next.language;
        this.getCurrentAccount();
    }

    ngOnInit() {
        this.selectedCountry = this.cookieService.get('country') || 'IL';
        this.store.pipe(select(currentUser), takeUntil(this.destroy$)).subscribe((user) => {
            this.user = user;
        });
       
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onSignOut() {
        this.authService.logout();
        // window.location.href = '/';
    }

    onSwitchLang() {
        i18next.changeLanguage(this.selectedLanguage).then((result) => {
            window.location.reload();
        });
    }

    getCurrentAccount() {
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

                // this.selectCurrentAccount();
            });
    }

    selectCurrentAccount() {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.store.dispatch(selectAccount({ id: accountId }));
        });
    }
}
