import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUserComponent } from '@modules/user/components/view-user/view-user.component';
import { CreateUserModalComponent } from '@modules/user/components/create-user/create-user-modal/create-user-modal.component';
import { UsersPageComponent } from '@modules/user/components/users-page/users-page.component';
import { ViewUserModalComponent } from '@modules/user/components/view-user/view-user-modal/view-user-modal.component';
import { StoreModule } from '@ngrx/store';
import { ViewUserPageComponent } from '@modules/user/components/view-user/view-user-page/view-user-page.component';
import { UserRoutingModule } from '@modules/user/user-routing.module';
import { CreateUserComponent } from '@modules/user/components/create-user/create-user.component';
import { DeleteUserComponent } from '@modules/user/components/delete-user/delete-user.component';
import { UpdateUserComponent } from '@modules/user/components/update-user/update-user.component';
import { CreateUserPageComponent } from '@modules/user/components/create-user/create-user-page/create-user-page.component';
import { SharedModule } from '@modules/shared/shared.module';
import * as fromUser from '@modules/user/ngrx/user.reducer';
import { ViewUsersComponent } from '@modules/user/components/view-users/view-users.component';
import { LogModule } from '@modules/log/log.module';
import { I18NextModule } from 'angular-i18next';
import { ViewUsersAdvancedComponent } from '@modules/user/components/view-users-advanced/view-users-advanced.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '@modules/user/ngrx/user.effects';
import { UpdateUserModalComponent } from '@modules/user/components/update-user-modal/update-user-modal.component';

@NgModule({
    declarations: [
        ViewUserComponent,
        ViewUsersComponent,
        CreateUserComponent,
        UpdateUserComponent,
        CreateUserModalComponent,
        CreateUserPageComponent,
        ViewUserPageComponent,
        ViewUserModalComponent,
        UsersPageComponent,
        DeleteUserComponent,
        ViewUsersAdvancedComponent,
        UpdateUserModalComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedModule,
        StoreModule.forFeature('user', fromUser.reducer),
        EffectsModule.forFeature([UserEffects]),
        LogModule,
        I18NextModule,
    ],
    exports: [
        ViewUserComponent,
        ViewUsersComponent,
        CreateUserComponent,
        UpdateUserComponent,
        CreateUserModalComponent,
        CreateUserPageComponent,
        ViewUserPageComponent,
        ViewUserModalComponent,
        UsersPageComponent,
        DeleteUserComponent,
    ],
    entryComponents: [CreateUserModalComponent, ViewUserModalComponent, UpdateUserModalComponent],
})
export class UserModule {}
