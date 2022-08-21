import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import { AuthService } from '@modules/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-forgot-password-request',
    templateUrl: './forgot-password-request.component.html',
    styleUrls: ['./forgot-password-request.component.less'],
})
export class ForgotPasswordRequestComponent implements OnInit {
    forgotPasswordRequest: FormGroup;
    forgotPasswordRequestState: ElementStateModel<User> = new ElementStateModel<User>();

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.forgotPasswordRequest = this.fb.group({
            email: [null, [Validators.required]],
        });
    }

    onRequestPasswordReset() {
        this.forgotPasswordRequestState.submit();
        this.auth.forgotPassword(this.forgotPasswordRequest.value.email).subscribe(
            (result) => {
                this.forgotPasswordRequestState.onSuccess(
                    'We have sent you an email to update your password, please follow the instructions provided',
                );
            },
            (error) => {
                this.forgotPasswordRequestState.onFailure(error.message);
            },
        );
    }
}
