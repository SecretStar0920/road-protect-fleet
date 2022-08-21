import { createSelector } from '@ngrx/store';
import { accountUserEntityAdapter, selectAccountUserFeatureState } from '@modules/account-user/ngrx/account-user.reducer';
import { filter } from 'lodash';

export const { selectIds, selectEntities, selectAll, selectTotal } = accountUserEntityAdapter.getSelectors(selectAccountUserFeatureState);

export const getAccountUsersByAccountId = (accountId: number) => {
    return createSelector(selectAll, (accountUsers) => {
        return filter(accountUsers, (accountUser) => {
            return accountUser.account.accountId === accountId && !accountUser.hidden;
        });
    });
};
