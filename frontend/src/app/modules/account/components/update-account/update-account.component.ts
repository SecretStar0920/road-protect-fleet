import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Account, AccountRole } from '@modules/shared/models/entities/account.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountService } from '@modules/account/services/account.service';
import { NGXLogger } from 'ngx-logger';
import { UserType } from '@modules/shared/models/entities/user.model';
import { getChangedObject } from '@modules/shared/functions/get-update-obj.function';
import i18next from 'i18next';
import { get, omit } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-update-account',
    templateUrl: './update-account.component.html',
    styleUrls: ['./update-account.component.less'],
})
export class UpdateAccountComponent implements OnInit, OnDestroy {
    @Input() account: Account;
    private destroy$ = new Subject();

    updateAccountForm: FormGroup;
    updateAccountState: ElementStateModel<Account> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Account>> = new EventEmitter();

    userTypes = UserType;
    accountRoles = Object.values(AccountRole);

    private initialFormValue: any;

    get f() {
        return this.updateAccountForm.controls;
    }

    constructor(private accountService: AccountService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateAccountForm = this.fb.group({
            basicDetails: new FormGroup({
                name: new FormControl(this.account.name, Validators.required),
                identifier: new FormControl(this.account.identifier, Validators.required),
                isVerified: new FormControl(this.account.isVerified, Validators.required),
                managed: new FormControl(this.account.managed, Validators.required),
                primaryContact: new FormControl(this.account.primaryContact, [Validators.required, Validators.email]),
                role: new FormControl(this.account.role, [Validators.required]),
            }),

            details: new FormGroup({
                name: new FormControl(this.account.details.name),
                telephone: new FormControl(this.account.details.telephone),
                fax: new FormControl(this.account.details.fax),
            }),

            postalLocation: new FormGroup({
                city: new FormControl(null, Validators.required),
                country: new FormControl(null, Validators.required),
                code: new FormControl(null),
                postOfficeBox: new FormControl(null, Validators.required),
            }),

            requestInformationDetails: new FormGroup({
                canSendRequest: new FormControl(this.account.requestInformationDetails?.canSendRequest),
                senderName: new FormControl(this.account.requestInformationDetails?.senderName),
                senderRole: new FormControl(this.account.requestInformationDetails?.senderRole),
            }),
        });

        if (this.account.postalLocation) {
            this.updateAccountForm.controls.postalLocation['controls'].city.setValue(this.account.postalLocation.city);
            this.updateAccountForm.controls.postalLocation['controls'].country.setValue(this.account.postalLocation.country);
            this.updateAccountForm.controls.postalLocation['controls'].code.setValue(this.account.postalLocation.code);
            this.updateAccountForm.controls.postalLocation['controls'].postOfficeBox.setValue(this.account.postalLocation.postOfficeBox);
        }

        this.initialFormValue = {
            ...this.updateAccountForm.value.basicDetails,
            ...omit(this.updateAccountForm.value, ['basicDetails']),
            // Added since this is set in the shared address component
            physicalLocation: this.account.physicalLocation,
        };

        this.updateAccountForm
            .get('requestInformationDetails.canSendRequest')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.updateAccountForm.get('requestInformationDetails.senderName').setValidators(Validators.required);
                    this.updateAccountForm.get('requestInformationDetails.senderRole').setValidators(Validators.required);
                } else {
                    this.updateAccountForm.get('requestInformationDetails.senderName').clearValidators();
                    this.updateAccountForm.get('requestInformationDetails.senderRole').clearValidators();
                }

                this.updateAccountForm.get('requestInformationDetails.senderName').updateValueAndValidity();
                this.updateAccountForm.get('requestInformationDetails.senderRole').updateValueAndValidity();
            });
    }

    isValid() {
        return (
            this.updateAccountForm.controls.basicDetails.valid &&
            this.updateAccountForm.controls.requestInformationDetails.valid &&
            this.locationIsValid()
        );
    }

    locationIsValid() {
        return (
            get(this.updateAccountForm, 'controls.physicalLocation.valid', false) ||
            get(this.updateAccountForm, 'controls.postalLocation.valid', false)
        );
    }

    onUpdateAccount() {
        this.updateAccountState.submit();

        let formValue: {};
        if (this.updateAccountForm.get('requestInformationDetails.canSendRequest').value) {
            formValue = {
                ...this.updateAccountForm.value.basicDetails,
                ...omit(this.updateAccountForm.value, ['basicDetails']),
            };
        } else {
            formValue = {
                ...this.updateAccountForm.value.basicDetails,
                ...omit(this.updateAccountForm.value, [
                    'basicDetails',
                    'requestInformationDetails.senderRole',
                    'requestInformationDetails.senderName',
                ]),
            };
        }

        this.accountService
            .updateAccountV2(this.account.accountId, {
                ...getChangedObject(this.initialFormValue, formValue),
            })
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated account', result);
                    this.updateAccountState.onSuccess(i18next.t('update-account.success'), result);
                    this.complete.emit(this.updateAccountState);
                },
                (error) => {
                    this.logger.error('Failed to update account', error);
                    this.updateAccountState.onFailure(i18next.t('update-account.fail'), error.error);
                    this.complete.emit(this.updateAccountState);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
