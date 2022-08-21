import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Location } from '@modules/shared/models/entities/location.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { createReducer } from '@ngrx/store';

export interface LocationState extends GeneralEntityState<Location> {
    // additional entities state properties
}

export const locationEntityAdapter: EntityAdapter<Location> = createEntityAdapter<Location>({
    selectId: (location) => location.locationId,
});

export const initialLocationState: LocationState = locationEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});
export const selectLocationFeatureState = (state) => state.location;
export const locationNgrxHelper = new GeneralEntityNGRX<Location, any, any, LocationState>(
    'Location',
    selectLocationFeatureState,
    locationEntityAdapter,
);

export const locationReducer = createReducer(initialLocationState, ...locationNgrxHelper.reducerOns);

export function reducer(state = initialLocationState, action): LocationState {
    return locationReducer(state, action);
}
