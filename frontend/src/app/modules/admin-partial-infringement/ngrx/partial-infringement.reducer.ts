import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { createReducer } from '@ngrx/store';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { CreatePartialInfringementDto } from '@modules/admin-partial-infringement/services/create-partial-infringement.dto';
import { UpdatePartialInfringementDto } from '@modules/admin-partial-infringement/services/update-partial-infringement.dto';

export interface PartialInfringementState extends GeneralEntityState<PartialInfringement> {}

export const partialInfringementEntityAdapter: EntityAdapter<PartialInfringement> = createEntityAdapter<PartialInfringement>({
    selectId: (partialInfringement) => partialInfringement.partialInfringementId,
});

export const initialPartialInfringementState: PartialInfringementState = partialInfringementEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectPartialInfringementFeatureState = (state) => state.partialInfringement;
export const partialInfringementNgrxHelper = new GeneralEntityNGRX<
    PartialInfringement,
    CreatePartialInfringementDto,
    UpdatePartialInfringementDto,
    PartialInfringementState
>('PartialInfringement', selectPartialInfringementFeatureState, partialInfringementEntityAdapter);

export const partialInfringementReducer = createReducer(initialPartialInfringementState, ...partialInfringementNgrxHelper.reducerOns);

export function reducer(state = initialPartialInfringementState, action): PartialInfringementState {
    return partialInfringementReducer(state, action);
}
