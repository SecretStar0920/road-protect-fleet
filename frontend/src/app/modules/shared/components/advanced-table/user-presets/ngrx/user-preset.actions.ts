import { createAction, props } from '@ngrx/store';
import {
    AdvancedTableNameEnum,
    UpsertUserPreferenceDto,
    UserPreset,
} from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { RequestAction } from '@modules/shared/models/ngrx/request.action';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

export const setCurrentFilters = createAction('[User Preset] Update current filters', props<{ filters: { [key: string]: any } }>());
export const setCurrentColumns = createAction('[User Preset] Update current columns', props<{ columns: AdvancedTableColumn[] }>());
export const setCurrentColumnsNames = createAction('[User Preset] Update current columns names', props<{ columns: string[] }>());

export const requestUserPresets = new RequestAction<UserPreset, any>('User Preset', 'Get User Presets');
export const requestSaveUserPresets = new RequestAction<UserPreset, UpsertUserPreferenceDto>('User Preset', 'Save User Presets');
export const requestDeleteUserPresets = new RequestAction<UserPreset, UpsertUserPreferenceDto>('User Preset', 'Delete User Presets');

export const setTableView = createAction('[User Preset] Setting table view', props<{ tableName: AdvancedTableNameEnum }>());
