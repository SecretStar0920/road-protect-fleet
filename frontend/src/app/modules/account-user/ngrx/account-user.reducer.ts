import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateAccountUserDto } from '@modules/account-user/services/create-account-user.dto';
import { UpdateAccountUserDto } from '@modules/account-user/services/update-account-user.dto';
import { createReducer } from '@ngrx/store';

export const accountUserEntityAdapter: EntityAdapter<AccountUser> = createEntityAdapter<AccountUser>({
    selectId: (accountUser) => accountUser.accountUserId,
});

export interface AccountUserState extends GeneralEntityState<AccountUser> {}

export const initialAccountUserState: AccountUserState = accountUserEntityAdapter.getInitialState({
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    queryParams: {},
});
export const selectAccountUserFeatureState = (state) => state.accountUser;

export const accountUserNgrxHelper = new GeneralEntityNGRX<AccountUser, CreateAccountUserDto, UpdateAccountUserDto, AccountUserState>(
    'Account User',
    selectAccountUserFeatureState,
    accountUserEntityAdapter,
);

export const accountUserReducer = createReducer(initialAccountUserState, ...accountUserNgrxHelper.reducerOns);

export function reducer(state = initialAccountUserState, action): AccountUserState {
    return accountUserReducer(state, action);
}
