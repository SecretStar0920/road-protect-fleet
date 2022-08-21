import { User } from '@modules/shared/models/entities/user.model';
import {
    changeAccountAction,
    completeCurrentUserSignupAction,
    loginAction,
    logoutCompleteAction,
    updateCurrentAccountAction,
    updateCurrentAvailableAccountsAction,
    updateCurrentPermissions,
    updateCurrentRoleAction,
    updateCurrentUserAction,
} from '@modules/auth/ngrx/auth.actions';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Account } from '@modules/shared/models/entities/account.model';
import { Role } from '@modules/shared/models/entities/role.model';
import { RolePermission } from '@modules/shared/models/entities/role-permission.model';

export interface AuthState {
    token: string;
    user: User; // A basic user object for the current user
    availableAccounts: Account[]; // What accounts is the user a part of?
    accountUserId: number; // Current accountUserId
    accountId: number; // Current accountId
    currentAccount: Account; // Current account object
    currentRole: Role; // The current role and associated permissions, useful for permissions directives
    currentPermissions: RolePermission[];
}

export const initialAuthState: AuthState = {
    token: undefined,
    user: undefined,
    availableAccounts: [],
    accountUserId: undefined,
    accountId: undefined,
    currentAccount: undefined,
    currentRole: undefined,
    currentPermissions: [],
};

export const authReducer = createReducer(
    initialAuthState,
    on(loginAction, (state, action) => {
        return {
            ...state,
            user: action.user,
            token: action.token,
            accountUserId: action.accountUserId,
            accountId: action.accountId,
        };
    }),
    on(changeAccountAction, (state, action) => {
        return {
            ...state,
            accountUserId: action.accountUserId,
            accountId: action.accountId,
            token: action.token,
        };
    }),
    on(updateCurrentUserAction, (state, action) => {
        return {
            ...state,
            user: action.user,
        };
    }),
    on(completeCurrentUserSignupAction, (state, action) => {
        const user = {
            ...state.user,
            completedSignup: true,
        };
        localStorage.setItem('user', JSON.stringify(user));
        return {
            ...state,
            user,
        };
    }),
    on(updateCurrentAccountAction, (state, action) => {
        return {
            ...state,
            currentAccount: action.account,
        };
    }),
    on(updateCurrentRoleAction, (state, action) => {
        return {
            ...state,
            currentRole: action.role,
        };
    }),
    on(updateCurrentPermissions, (state, action) => {
        return {
            ...state,
            currentPermissions: action.permissions,
        };
    }),
    on(updateCurrentAvailableAccountsAction, (state, action) => {
        return {
            ...state,
            availableAccounts: action.accounts,
        };
    }),
    on(logoutCompleteAction, (state, action) => {
        return initialAuthState;
    }),
);

export function reducer(state = initialAuthState, action): AuthState {
    return authReducer(state, action);
}

const authFeatureSelector = createFeatureSelector('auth');

export const currentToken = createSelector(authFeatureSelector, (state: AuthState) => state.token);

export const currentUser = createSelector(authFeatureSelector, (state: AuthState) => state.user);

export const currentRole = createSelector(authFeatureSelector, (state: AuthState) => state.currentRole);

export const currentPermissions = createSelector(authFeatureSelector, (state: AuthState) => state.currentPermissions);

export const currentAccountUserId = createSelector(authFeatureSelector, (state: AuthState) => state.accountUserId);

export const currentAccountId = createSelector(authFeatureSelector, (state: AuthState) => state.accountId);

export const currentAccount = createSelector(authFeatureSelector, (state: AuthState) => state.currentAccount);

export const availableAccounts = createSelector(authFeatureSelector, (state: AuthState) => state.availableAccounts);
