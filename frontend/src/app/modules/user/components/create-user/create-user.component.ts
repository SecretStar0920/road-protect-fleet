import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '@modules/user/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.less'],
})
export class CreateUserComponent implements OnInit {
    createUserForm: FormGroup;
    createUserState: ElementStateModel<User> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    userTypes = Object.values(UserType);

    get f() {
        return this.createUserForm.controls;
    }

    constructor(private userService: UserService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createUserForm = this.fb.group({
            name: new FormControl('', Validators.required),
            surname: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            type: new FormControl(UserType.Standard, Validators.required),
            cellphoneNumber: new FormControl(''),
        });
    }

    onCreateUser() {
        this.createUserState.submit();
        this.userService.createUser(this.createUserForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created user', result);
                this.createUserState.onSuccess(i18next.t('create-user.success'), result);
                this.complete.emit(this.createUserState);
            },
            (error) => {
                this.logger.error('Failed to create user', error);
                this.createUserState.onFailure(i18next.t('create-user.fail'), error.error);
                this.complete.emit(this.createUserState);
            },
        );
    }
}
