import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountUserService } from '@modules/account-user/services/account-user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-account-user',
    templateUrl: './create-account-user.component.html',
    styleUrls: ['./create-account-user.component.less'],
})
export class CreateAccountUserComponent implements OnInit {
    createAccountUserForm: FormGroup;
    createAccountUserState: ElementStateModel<AccountUser> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();
    @Input() accountId: number;

    get f() {
        return this.createAccountUserForm.controls;
    }

    constructor(
        private accountUserService: AccountUserService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private store: Store<AppState>,
    ) {}

    ngOnInit() {
        this.createAccountUserForm = this.fb.group({
            userEmail: new FormControl('', [Validators.email, Validators.required]),
            userName: new FormControl('', Validators.required),
            userSurname: new FormControl('', Validators.required),
            roleNames: new FormControl('', Validators.required),
            account: new FormControl(this.accountId, Validators.required),
        });

        if (!this.accountId) {
            this.store.pipe(select(currentAccountId)).subscribe((accountId) => {
                this.accountId = accountId;
                this.createAccountUserForm.controls.account.setValue(accountId);
            });
        }
    }

    onCreateAccountUser() {
        this.createAccountUserState.submit();
        this.accountUserService.createAccountUser(this.createAccountUserForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Account User', result);
                this.createAccountUserState.onSuccess(i18next.t('create-account-user.success'), result);
                this.complete.emit(this.createAccountUserState);
            },
            (error) => {
                this.logger.error('Failed to create Account User', error);
                this.createAccountUserState.onFailure(i18next.t('create-account-user.fail'), error.error);
                this.complete.emit(this.createAccountUserState);
            },
        );
    }
}
