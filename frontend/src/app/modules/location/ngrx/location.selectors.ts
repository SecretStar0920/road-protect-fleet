import { createSelector } from '@ngrx/store';
import { locationEntityAdapter, selectLocationFeatureState } from '@modules/location/ngrx/location.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = locationEntityAdapter.getSelectors(selectLocationFeatureState);

export const getLocationById = (locationId: number) => {
    return createSelector(selectEntities, (locationEntities) => locationEntities[locationId]);
};
