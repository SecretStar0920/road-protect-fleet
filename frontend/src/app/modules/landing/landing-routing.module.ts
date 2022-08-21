import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '@modules/landing/components/landing/landing.component';
import { LoginComponent } from '@modules/auth/components/login/login.component';
import { ForgotPasswordRequestComponent } from '@modules/auth/components/forgot-password-request/forgot-password-request.component';
import { ForgotPasswordConfirmComponent } from '@modules/auth/components/forgot-password-confirm/forgot-password-confirm.component';

const routes: Routes = [
    {
        path: '',
        component: LandingComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordRequestComponent,
            },
            {
                path: 'forgot-password/confirm/:jwt',
                component: ForgotPasswordConfirmComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LandingRoutingModule {}
