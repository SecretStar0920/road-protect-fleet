import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@modules/auth/services/auth.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import { Router } from '@angular/router';
import i18next from 'i18next';
import { environment } from '@environment/environment';

@Component({
    selector: 'rp-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginState: ElementStateModel<User> = new ElementStateModel<User>();

    siteKey = environment.google.recaptcha.siteKey;
    recaptchaKey: string = null;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: [null],
            password: [null],
        });
    }

    onLogin() {
        this.loginForm.controls['email'].setValidators([Validators.required]);
        this.loginForm.controls['email'].updateValueAndValidity();
        this.loginForm.controls['password'].setValidators([Validators.required]);
        this.loginForm.controls['password'].updateValueAndValidity();

        if (this.loginForm.valid) {
            this.loginState.submit();
            this.auth.login(this.loginForm.value.email, this.loginForm.value.password, this.recaptchaKey).subscribe(
                (user) => {
                    this.router.navigate(['/home']).then(() => this.loginState.onSuccess(i18next.t('login.success'), user));
                },
                (error) => {
                    this.loginState.onFailure(i18next.t('login.fail'), error.error || {});
                },
            );
        }
    }

    onRecaptchaResolved(recaptchaKey: string) {
        this.recaptchaKey = recaptchaKey;
    }
}
