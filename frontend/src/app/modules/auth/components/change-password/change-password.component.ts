import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
    selector: 'rp-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.less'],
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;

    @Input() email: string;
    @Output() changedPassword = new EventEmitter<boolean>();
    changePasswordState: ElementStateModel<User> = new ElementStateModel<User>();

    constructor(private fb: FormBuilder, private auth: AuthService) {}

    ngOnInit() {
        this.changePasswordForm = this.fb.group({
            newPassword: [null, [Validators.required]],
            passwordConfirm: [null, [Validators.required, this.passwordsMatch.bind(this)]],
        });
    }

    passwordsMatch(control: FormControl): { [s: string]: boolean } {
        if (this.changePasswordForm?.get('newPassword')?.value === this.changePasswordForm?.get('passwordConfirm')?.value) {
            return null;
        }
        return { passwordMatch: true };
    }

    onPasswordChange() {
        if (!this.changePasswordForm.valid) {
            return;
        }
        this.changePasswordState.submit();
        this.auth.changePassword(this.changePasswordForm?.get('newPassword')?.value, this.email).subscribe(
            (result) => {
                this.changePasswordState.onSuccess('Your password has successfully been changed');
                this.changedPassword.emit(true);
            },
            (error) => {
                this.changePasswordState.onFailure(error.message, error);
                this.changedPassword.emit(false);
            },
        );
    }
}
