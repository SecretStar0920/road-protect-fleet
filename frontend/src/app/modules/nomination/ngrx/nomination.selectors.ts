import { createSelector } from '@ngrx/store';
import { nominationNgrxHelper, NominationState, selectNominationFeatureState } from '@modules/nomination/ngrx/nomination.reducer';
import { filter, isNil } from 'lodash';

export const { selectIds, selectEntities, selectAll, selectTotal } = nominationNgrxHelper.entitySelectors;

export const getNominationById = (nominationId: number) => {
    return createSelector(selectEntities, (nominationEntities) => nominationEntities[nominationId]);
};

export const getBatchPaymentResultData = createSelector(
    selectNominationFeatureState,
    (state: NominationState) => state.batchPaymentResultData,
);

export const getBatchMunicipalRedirectionResultData = createSelector(
    selectNominationFeatureState,
    (state: NominationState) => state.batchMunicipalRedirectionResultData,
);

export const getBatchDigitalRedirectionResultData = createSelector(
    selectNominationFeatureState,
    (state: NominationState) => state.batchDigitalRedirectionResultData,
);

export const getNominationByAccountId = (accountId: number) => {
    return createSelector(selectAll, (nominations) => {
        return filter(nominations, (nomination) => {
            if (isNil(nomination.account)) {
                return false;
            }
            return nomination.account.accountId === accountId;
        });
    });
};

export const getNominationByInfringementId = (infringementId: number) => {
    return createSelector(selectAll, (nominations) => {
        return filter(nominations, (nomination) => {
            if (isNil(nomination.infringement)) {
                return false;
            }
            return nomination.infringement.infringementId === infringementId;
        });
    });
};

export const isLoading = createSelector(selectNominationFeatureState, (state: NominationState) => state.nominationLoading > 0);
