import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { GuestGuard } from '@modules/auth/guards/guest.guard';
import i18next from 'i18next';

const routes: Routes = [
    {
        path: '',
        canActivate: [GuestGuard],
        canActivateChild: [GuestGuard],
        loadChildren: () => import('./modules/landing/landing.module').then((mod) => mod.LandingModule),
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('./modules/home/home.module').then((mod) => mod.HomeModule),
        data: {
            breadcrumb: i18next.t('breadcrumb.home'),
        },
    },
    // ** page not found
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
