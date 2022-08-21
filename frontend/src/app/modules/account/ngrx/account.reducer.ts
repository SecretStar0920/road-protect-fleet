import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Account } from '@modules/shared/models/entities/account.model';
import { selectAccount } from './account.actions';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateAccountV2Dto } from '@modules/account/services/create-account-v2.dto';
import { UpdateAccountV2Dto } from '@modules/account/services/update-account-v2.dto';
import { createReducer, on } from '@ngrx/store';

export interface AccountState extends GeneralEntityState<Account> {
    selectedAccount: number;
}

export const accountEntityAdapter: EntityAdapter<Account> = createEntityAdapter<Account>({ selectId: (account) => account.accountId });

export const initialAccountState: AccountState = accountEntityAdapter.getInitialState({
    selectedAccount: null,
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    queryParams: {},
});

export const selectAccountFeatureState = (state) => state.account;
export const accountNgrxHelper = new GeneralEntityNGRX<Account, CreateAccountV2Dto, UpdateAccountV2Dto, AccountState>(
    'Account',
    selectAccountFeatureState,
    accountEntityAdapter,
);

export const accountReducer = createReducer(
    initialAccountState,
    ...accountNgrxHelper.reducerOns,
    on(selectAccount, (state, action) => {
        return {
            ...state,
            selectedAccount: action.id,
        };
    }),
);

export function reducer(state = initialAccountState, action): AccountState {
    return accountReducer(state, action);
}
