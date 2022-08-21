import * as fromAccountUser from '@modules/account-user/ngrx/account-user.reducer';
import { AccountUsersPageComponent } from '@modules/account-user/components/account-users-page/account-users-page.component';
import { CommonModule } from '@angular/common';
import { CreateAccountUserComponent } from '@modules/account-user/components/create-account-user/create-account-user.component';
import { CreateAccountUserModalComponent } from '@modules/account-user/components/create-account-user/create-account-user-modal/create-account-user-modal.component';
import { CreateAccountUserPageComponent } from '@modules/account-user/components/create-account-user/create-account-user-page/create-account-user-page.component';
import { DeleteAccountUserComponent } from './components/delete-account-user/delete-account-user.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { UpdateAccountUserComponent } from '@modules/account-user/components/update-account-user/update-account-user.component';
import { ViewAccountUserComponent } from '@modules/account-user/components/view-account-user/view-account-user.component';
import { ViewAccountUserModalComponent } from '@modules/account-user/components/view-account-user/view-account-user-modal/view-account-user-modal.component';
import { ViewAccountUserPageComponent } from '@modules/account-user/components/view-account-user/view-account-user-page/view-account-user-page.component';
import { ViewAccountUsersComponent } from '@modules/account-user/components/view-account-users/view-account-users.component';
import { I18NextModule } from 'angular-i18next';
import { ViewCurrentAccountUserPermissionsComponent } from './components/view-current-account-user-permissions/view-current-account-user-permissions.component';
import { ViewCurrentPermissionsButtonComponent } from './components/view-current-account-user-permissions/view-current-permissions-button/view-current-permissions-button.component';
import { ViewAccountUsersAdvancedComponent } from '@modules/account-user/components/view-account-users-advanced/view-account-users-advanced.component';

@NgModule({
    declarations: [
        ViewAccountUserComponent,
        ViewAccountUsersComponent,
        CreateAccountUserComponent,
        UpdateAccountUserComponent,
        CreateAccountUserModalComponent,
        CreateAccountUserPageComponent,
        ViewAccountUserPageComponent,
        ViewAccountUserModalComponent,
        AccountUsersPageComponent,
        DeleteAccountUserComponent,
        ViewCurrentAccountUserPermissionsComponent,
        ViewCurrentPermissionsButtonComponent,
        ViewAccountUsersAdvancedComponent,
    ],
    imports: [CommonModule, SharedModule, StoreModule.forFeature('accountUser', fromAccountUser.reducer), I18NextModule],
    exports: [
        ViewAccountUserComponent,
        ViewAccountUsersComponent,
        CreateAccountUserComponent,
        UpdateAccountUserComponent,
        CreateAccountUserModalComponent,
        CreateAccountUserPageComponent,
        ViewAccountUserPageComponent,
        ViewAccountUserModalComponent,
        AccountUsersPageComponent,
        DeleteAccountUserComponent,
        ViewCurrentAccountUserPermissionsComponent,
        ViewCurrentPermissionsButtonComponent,
    ],
    entryComponents: [CreateAccountUserModalComponent, ViewAccountUserModalComponent],
})
export class AccountUserModule {}
