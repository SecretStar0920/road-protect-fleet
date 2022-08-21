import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import { AuthService } from '@modules/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-forgot-password-confirm',
    templateUrl: './forgot-password-confirm.component.html',
    styleUrls: ['./forgot-password-confirm.component.less'],
})
export class ForgotPasswordConfirmComponent implements OnInit {
    forgotPasswordConfirm: FormGroup;
    forgotPasswordConfirmState: ElementStateModel<User> = new ElementStateModel<User>();
    jwt: string;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.forgotPasswordConfirm = this.fb.group({
            newPassword: [null, [Validators.required]],
            passwordConfirm: [null, [Validators.required]],
            jwt: [null, [Validators.required]],
        });
        this.activatedRoute.params.subscribe((params) => {
            this.forgotPasswordConfirm.controls.jwt.setValue(params.jwt);
        });
    }

    onConfirmPasswordReset() {
        this.forgotPasswordConfirmState.submit();
        this.auth.forgotPasswordConfirm(this.forgotPasswordConfirm.value.newPassword, this.forgotPasswordConfirm.value.jwt).subscribe(
            (result) => {
                this.forgotPasswordConfirmState.onSuccess('Your password has successfully been changed, redirecting you to the login page');

                setTimeout(() => {
                    this.router.navigateByUrl('/login');
                }, 2000);
            },
            (error) => {
                this.forgotPasswordConfirmState.onFailure(error.message);
            },
        );
    }
}
