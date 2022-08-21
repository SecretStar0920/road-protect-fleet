import { addRequest, completeRequest } from './global-loading.actions';
import { createReducer, on } from '@ngrx/store';

export interface GlobalLoadingState {
    totalRequests: number;
    totalRequestsCompleted: number;
}

export const initialState: GlobalLoadingState = {
    totalRequests: 0,
    totalRequestsCompleted: 0,
};

export const loadingReducer = createReducer(
    initialState,
    on(addRequest, (state, action) => {
        return {
            ...state,
            totalRequests: state.totalRequests + 1,
        };
    }),
    on(completeRequest, (state, action) => {
        return {
            ...state,
            totalRequestsCompleted: state.totalRequestsCompleted + 1,
        };
    }),
);

export function reducer(state = initialState, action): GlobalLoadingState {
    return loadingReducer(state, action);
}
