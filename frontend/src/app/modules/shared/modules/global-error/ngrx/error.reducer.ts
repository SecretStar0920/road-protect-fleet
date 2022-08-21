import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { GlobalError } from './global-error.model';
import { createReducer, createSelector } from '@ngrx/store';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';

export interface ErrorState extends GeneralEntityState<GlobalError> {
    // additional entities state properties
}

export const adapter: EntityAdapter<GlobalError> = createEntityAdapter<GlobalError>();

export const initialState: ErrorState = adapter.getInitialState({
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});
const errorFeatureState = (state) => state.error;

export const errorNgrxHelper = new GeneralEntityNGRX('Error', errorFeatureState, adapter);

export const errorReducer = createReducer(initialState, ...errorNgrxHelper.reducerOns);

export function reducer(state = initialState, action): ErrorState {
    return errorReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = errorNgrxHelper.entitySelectors;

export const selectUnacknowledged = createSelector(selectAll, (errors) => {
    return errors.filter((error) => !error.acknowledged);
});
