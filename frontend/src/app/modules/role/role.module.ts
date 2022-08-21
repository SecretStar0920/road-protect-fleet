import * as fromRole from '@modules/role/ngrx/role.reducer';
import { RolesPageComponent } from '@modules/role/components/roles-page/roles-page.component';
import { CommonModule } from '@angular/common';
import { CreateRoleComponent } from '@modules/role/components/create-role/create-role.component';
import { CreateRoleModalComponent } from '@modules/role/components/create-role/create-role-modal/create-role-modal.component';
import { CreateRolePageComponent } from '@modules/role/components/create-role/create-role-page/create-role-page.component';
import { DeleteRoleComponent } from './components/delete-role/delete-role.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UpdateRoleComponent } from '@modules/role/components/update-role/update-role.component';
import { ViewRoleComponent } from '@modules/role/components/view-role/view-role.component';
import { ViewRoleModalComponent } from '@modules/role/components/view-role/view-role-modal/view-role-modal.component';
import { ViewRolePageComponent } from '@modules/role/components/view-role/view-role-page/view-role-page.component';
import { ViewRolesComponent } from '@modules/role/components/view-roles/view-roles.component';
import { RoleEffects } from '@modules/role/ngrx/role.effects';
import { I18NextModule } from 'angular-i18next';

@NgModule({
    declarations: [
        ViewRoleComponent,
        ViewRolesComponent,
        CreateRoleComponent,
        UpdateRoleComponent,
        CreateRoleModalComponent,
        CreateRolePageComponent,
        ViewRolePageComponent,
        ViewRoleModalComponent,
        RolesPageComponent,
        DeleteRoleComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('role', fromRole.reducer),
        EffectsModule.forFeature([RoleEffects]),
        I18NextModule,
    ],
    exports: [
        ViewRoleComponent,
        ViewRolesComponent,
        CreateRoleComponent,
        UpdateRoleComponent,
        CreateRoleModalComponent,
        CreateRolePageComponent,
        ViewRolePageComponent,
        ViewRoleModalComponent,
        RolesPageComponent,
        DeleteRoleComponent,
    ],
    entryComponents: [CreateRoleModalComponent, ViewRoleModalComponent],
})
export class RoleModule {}
