import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InfringementProjectionState } from '@modules/infringement-projection/ngrx/infringement-projection.reducer';

const infringementProjectionSelector = createFeatureSelector('infringement-projection');

export const rawInfringementProjectionData = createSelector(
    infringementProjectionSelector,
    (state: InfringementProjectionState) => state.rawData,
);

export const getEndpoint = createSelector(infringementProjectionSelector, (state: InfringementProjectionState) => state.endpoint);
