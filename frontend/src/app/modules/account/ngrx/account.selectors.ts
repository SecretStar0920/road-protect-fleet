import { createSelector } from '@ngrx/store';
import { accountEntityAdapter, AccountState, selectAccountFeatureState } from '@modules/account/ngrx/account.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = accountEntityAdapter.getSelectors(selectAccountFeatureState);

// TODO: replace with ngrx entity helper for these
export const getSelectedAccountId = createSelector(selectAccountFeatureState, (state: AccountState) => state.selectedAccount);

export const getSelectedAccount = createSelector(getSelectedAccountId, selectEntities, (accountId: number, entities) => {
    return { id: accountId, account: entities[accountId] };
});

export const getAccountByIdentifier = (identifier: string) => {
    return createSelector(selectAll, (accountEntities) => accountEntities.filter((account) => account.identifier === identifier));
};
