import { createAction, props } from '@ngrx/store';
import { User } from '@modules/shared/models/entities/user.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { Role } from '@modules/shared/models/entities/role.model';
import { RolePermission } from '@modules/shared/models/entities/role-permission.model';

export const loginAction = createAction('[Auth] Login', props<{ user: User; token: string; accountUserId: number; accountId: number }>());

export const updateCurrentUserAction = createAction('[Auth] Update Current User', props<{ user: User }>());

export const completeCurrentUserSignupAction = createAction('[Auth] Complete Current User Signup', props<{ isComplete: boolean }>());

export const updateCurrentAccountAction = createAction('[Auth] Update Current Account', props<{ account: Account }>());

export const updateCurrentRoleAction = createAction('[Auth] Update Current Role', props<{ role: Role }>());

export const updateCurrentPermissions = createAction('[Auth] Update Current Permissions', props<{ permissions: RolePermission[]}>());

export const updateCurrentAvailableAccountsAction = createAction('[Auth] Update Available Accounts', props<{ accounts: Account[] }>());

export const changeAccountAction = createAction(
    '[Auth] Change Account',
    props<{ accountUserId: number; accountId: number; token: string }>(),
);

export const logoutAction = createAction('[Auth] Logout');

export const logoutCompleteAction = createAction('[Auth] Logout Complete');
