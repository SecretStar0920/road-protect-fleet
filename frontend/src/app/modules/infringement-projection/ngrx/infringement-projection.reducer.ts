import { createReducer, on } from '@ngrx/store';
import {
    InfringementPredictionEndpoints,
    InfringementProjectionDataDto,
} from '@modules/infringement-projection/services/infringement-projection.service';
import { updateEndpoint, clearInfringementProjectionData, requestInfringementProjectionData } from './infringement-projection.actions';

export interface InfringementProjectionState {
    rawData: InfringementProjectionDataDto;
    endpoint: InfringementPredictionEndpoints;
}

export const initialInfringementProjectionState: InfringementProjectionState = {
    rawData: undefined,
    endpoint: undefined,
};

export const infringementProjectionReducer = createReducer(
    initialInfringementProjectionState,
    on(clearInfringementProjectionData, (state, action) => {
        return {
            ...state,
            rawData: undefined,
        };
    }),
    on(updateEndpoint, (state, action) => {
        return {
            ...state,
            endpoint: action.endpoint,
        };
    }),
    on(requestInfringementProjectionData, (state, action) => {
        return {
            ...state,
            rawData: action.data,
        };
    }),
);

export function reducer(state = initialInfringementProjectionState, action): InfringementProjectionState {
    return infringementProjectionReducer(state, action);
}
