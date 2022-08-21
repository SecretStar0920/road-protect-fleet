import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AccountState } from '@modules/account/ngrx/account.reducer';
import { Account } from '@modules/shared/models/entities/account.model';
import * as fromAccount from '@modules/account/ngrx/account.selectors';
import { mergeMap } from 'rxjs/operators';
import { AccountService } from '@modules/account/services/account.service';
import { of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-account-dropdown',
    templateUrl: './account-dropdown.component.html',
    styleUrls: ['./account-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AccountDropdownComponent),
            multi: true,
        },
    ],
})
export class AccountDropdownComponent implements OnInit, ControlValueAccessor {
    hasInputOther: boolean = false;

    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input()
    accounts: Account[] = [];
    showPopover: boolean;

    @Input() isDisabled: boolean = false;
    @Input() hideCreateAccountMessage: boolean = false;
    @Input() defaultAccount: Account;

    createAccountVisible: boolean;

    private _selectedAccount: string | number;
    get selectedAccount(): string | number {
        return this._selectedAccount;
    }

    @Input()
    set selectedAccount(value: string | number) {
        this._selectedAccount = value;

        if (value) {
            this.selectedAccountEntity.emit(this.accounts.find((account) => account.accountId === value));
        } else {
            this.selectedAccountEntity.emit(null);
        }

        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    @Output() selectedAccountEntity = new EventEmitter<Account>();

    constructor(private store: Store<AccountState>, private accountService: AccountService, private message: NzMessageService) {}

    ngOnInit() {
        this.getAccounts();
        if (this.defaultAccount) {
            this._selectedAccount = this.defaultAccount.accountId;
            this.selectedAccountEntity.emit(this.accounts.find((account) => account.accountId === this.defaultAccount.accountId));
        }
    }

    getAccounts() {
        this.accountService.getAccountDropdownData().subscribe();
        this.store
            .pipe(
                select(fromAccount.selectAll),
                mergeMap((accounts) => {
                    // if (isEmpty(accounts)) {
                    //     return this.accountService.getAccountDropdownData();
                    // }
                    return of(accounts);
                }),
            )
            .subscribe((accounts) => {
                this.accounts = accounts;
            });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(value: string): void {
        if (value) {
            this.selectedAccount = value;
        }
    }

    onCreatedAccount(status: ElementStateModel<Account>) {
        if (status.hasSucceeded()) {
            this.selectedAccount = status.successResult().context.accountId;
            this.showPopover = false;
        } else if (status.hasFailed()) {
            this.message.error(status.failedResult().message);
        }
    }

    toggleCreateAccountDrawer() {
        this.createAccountVisible = !this.createAccountVisible;
    }
}
