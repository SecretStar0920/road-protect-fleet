import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@modules/auth/components/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './ngrx/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './ngrx/auth.effects';
import { MinimalSharedModule } from '@modules/minimal-shared/minimal-shared.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordRequestComponent } from './components/forgot-password-request/forgot-password-request.component';
import { ForgotPasswordConfirmComponent } from './components/forgot-password-confirm/forgot-password-confirm.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { ChangePasswordModalComponent } from '@modules/auth/components/change-password-modal/change-password-modal.component';

@NgModule({
    declarations: [
        LoginComponent,
        ChangePasswordComponent,
        ForgotPasswordRequestComponent,
        ForgotPasswordConfirmComponent,
        LoginPageComponent,
        ChangePasswordModalComponent,
    ],
    imports: [
        CommonModule,
        MinimalSharedModule,
        RecaptchaModule,
        StoreModule.forFeature('auth', fromAuth.reducer),
        EffectsModule.forFeature([AuthEffects]),
    ],
    exports: [LoginComponent, ForgotPasswordConfirmComponent, ForgotPasswordRequestComponent, ChangePasswordComponent],
    entryComponents: [ChangePasswordComponent, ChangePasswordModalComponent],
})
export class AuthModule {}
