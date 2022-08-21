import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountUserService } from '@modules/account-user/services/account-user.service';
import { NGXLogger } from 'ngx-logger';
import { getChangedObject } from '@modules/shared/functions/get-update-obj.function';
import { get } from 'lodash';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-account-user',
    templateUrl: './update-account-user.component.html',
    styleUrls: ['./update-account-user.component.less'],
})
export class UpdateAccountUserComponent implements OnInit {
    @Input() accountUser: AccountUser;

    updateAccountUserForm: FormGroup;
    updateAccountUserState: ElementStateModel<AccountUser> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<AccountUser>> = new EventEmitter();
    private initialFormValue: any;

    get f() {
        return this.updateAccountUserForm.controls;
    }

    constructor(private accountUserService: AccountUserService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateAccountUserForm = this.fb.group({
            name: new FormControl(this.accountUser.user.name, Validators.required),
            email: new FormControl(this.accountUser.user.email, Validators.required),
            roleNames: new FormControl(null, Validators.required),
        });

        if (this.accountUser.roles.length > 0) {
            // set array of values
            const values = this.accountUser.roles.map((role) => {
                return role.role.name;
            });
            this.updateAccountUserForm.controls.roleNames.setValue(values);
        }

        this.initialFormValue = this.updateAccountUserForm.value;
    }

    onUpdateAccountUser() {
        this.updateAccountUserState.submit();
        this.accountUserService.updateAccountUser(this.accountUser.accountUserId, this.updateAccountUserForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Account User', result);
                this.updateAccountUserState.onSuccess(i18next.t('update-account-user.success'), result);
                this.complete.emit(this.updateAccountUserState);
            },
            (error) => {
                this.logger.error('Failed to update Account User', error);
                this.updateAccountUserState.onFailure(i18next.t('update-account-user.fail'), error.error);
                this.complete.emit(this.updateAccountUserState);
            },
        );
    }
}
