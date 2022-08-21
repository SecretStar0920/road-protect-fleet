import { AdvancedTableNameEnum, UserPreset } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import {
    requestUserPresets,
    setTableView,
    requestSaveUserPresets,
    requestDeleteUserPresets,
    setCurrentFilters,
    setCurrentColumnsNames,
    setCurrentColumns,
} from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { createReducer, on } from '@ngrx/store';

export interface UserPresetState {
    userPresets: UserPreset;
    currentTableView: AdvancedTableNameEnum;
    loading: number;
    columns: string[];
    filters: { [key: string]: any };
}

export const initialUserState: UserPresetState = {
    userPresets: undefined,
    currentTableView: undefined,
    loading: 0,
    columns: undefined,
    filters: undefined,
};

export const userPresetReducer = createReducer(
    initialUserState,
    on(setTableView, (state, action) => {
        return {
            ...state,
            currentTableView: action.tableName,
        };
    }),
    on(setCurrentFilters, (state, action) => {
        return {
            ...state,
            filters: action.filters,
        };
    }),
    on(setCurrentColumns, (state) => {
        return { ...state };
    }),
    on(setCurrentColumnsNames, (state, action) => {
        return {
            ...state,
            columns: action.columns,
        };
    }),
    on(requestUserPresets.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),
    on(requestUserPresets.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(requestUserPresets.success, (state, action) => {
        return {
            ...state,
            loading: state.loading - 1,
            userPresets: action.result,
        };
    }),
    on(requestSaveUserPresets.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),
    on(requestSaveUserPresets.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(requestSaveUserPresets.success, (state, action) => {
        return {
            ...state,
            loading: state.loading - 1,
            userPresets: action.result,
        };
    }),
    on(requestDeleteUserPresets.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),
    on(requestDeleteUserPresets.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(requestDeleteUserPresets.success, (state, action) => {
        return {
            ...state,
            loading: state.loading - 1,
            userPresets: action.result,
        };
    }),
);

export function reducer(state = initialUserState, action): UserPresetState {
    return userPresetReducer(state, action);
}
