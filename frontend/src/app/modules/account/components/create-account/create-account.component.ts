import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '@modules/account/services/account.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Account, AccountRole } from '@modules/shared/models/entities/account.model';
import i18next from 'i18next';
import { omit, get } from 'lodash';
import { recursivelyRemoveNilKeys } from '@modules/shared/functions/get-update-obj.function';

@Component({
    selector: 'rp-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.less'],
})
export class CreateAccountComponent implements OnInit {
    createAccountForm: FormGroup;
    createAccountState: ElementStateModel<Account> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    accountRoles = Object.values(AccountRole);

    @Input() isVerified: boolean = true;

    get f() {
        return this.createAccountForm.controls;
    }

    constructor(private accountService: AccountService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createAccountForm = this.fb.group({
            basicDetails: new FormGroup({
                name: new FormControl(null, Validators.required),
                identifier: new FormControl(null, Validators.required),
                isVerified: new FormControl(this.isVerified, Validators.required),
                primaryContact: new FormControl(null, [Validators.email, Validators.required]),
                role: new FormControl(AccountRole.Hybrid, [Validators.required]),
            }),

            details: new FormGroup({
                name: new FormControl(null),
                telephone: new FormControl(null),
                fax: new FormControl(null),
            }),

            postalLocation: new FormGroup({
                city: new FormControl(null, Validators.required),
                country: new FormControl(null, Validators.required),
                code: new FormControl(null),
                postOfficeBox: new FormControl(null, Validators.required),
            }),
        });
    }

    isValid() {
        return this.createAccountForm.controls.basicDetails.valid && this.locationIsValid();
    }

    locationIsValid() {
        return (
            get(this.createAccountForm, 'controls.physicalLocation.valid', false) ||
            get(this.createAccountForm, 'controls.postalLocation.valid', false)
        );
    }

    onCreateAccount() {
        this.createAccountState.submit();
        const formValue = {
            ...this.createAccountForm.value.basicDetails,
            ...omit(this.createAccountForm.value, ['basicDetails']),
        };
        this.accountService.createAccountV2(recursivelyRemoveNilKeys(formValue)).subscribe(
            (result) => {
                this.logger.info('Successfully created account', result);
                this.createAccountState.onSuccess(i18next.t('create-account.success'), result);
                this.complete.emit(this.createAccountState);
            },
            (error) => {
                this.logger.error('Failed to create account', error);
                this.createAccountState.onFailure(i18next.t('create-account.fail'), error.error);
                this.complete.emit(this.createAccountState);
            },
        );
    }
}
