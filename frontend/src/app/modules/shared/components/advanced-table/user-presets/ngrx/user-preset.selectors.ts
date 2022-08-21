import { createSelector } from '@ngrx/store';
import { UserPresetState } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.reducer';

export const selectUserPresetFeatureState = (state) => state.userPreset;

export const userStateLoading = createSelector(selectUserPresetFeatureState, (state: UserPresetState) => state.loading);
export const userPresets = createSelector(selectUserPresetFeatureState, (state: UserPresetState) => state.userPresets);
export const currentTableView = createSelector(selectUserPresetFeatureState, (state: UserPresetState) => state.currentTableView);
export const currentFilters = createSelector(selectUserPresetFeatureState, (state: UserPresetState) => state.filters);
export const currentColumns = createSelector(selectUserPresetFeatureState, (state: UserPresetState) => state.columns);
