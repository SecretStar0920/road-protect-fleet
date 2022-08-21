import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Street } from '@modules/shared/models/entities/street.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateStreetDto } from '@modules/street/services/create-street.dto';
import { UpdateStreetDto } from '@modules/street/services/update-street.dto';
import { createReducer } from '@ngrx/store';

export interface StreetState extends GeneralEntityState<Street> {}

export const streetEntityAdapter: EntityAdapter<Street> = createEntityAdapter<Street>({ selectId: (street) => street.streetId });

export const initialStreetState: StreetState = streetEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectStreetFeatureState = (state) => state.street;
export const streetNgrxHelper = new GeneralEntityNGRX<Street, CreateStreetDto, UpdateStreetDto, StreetState>('Street', selectStreetFeatureState, streetEntityAdapter);

export const streetReducer = createReducer(initialStreetState, ...streetNgrxHelper.reducerOns);

export function reducer(state = initialStreetState, action): StreetState {
    return streetReducer(state, action);
}
