import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { RawInfringementLog } from '@modules/shared/models/entities/raw-infringement-log.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateRawInfringementLogDto } from '@modules/admin-log/raw-infringement-log/services/create-raw-infringement-log.dto';
import { UpdateRawInfringementLogDto } from '@modules/admin-log/raw-infringement-log/services/update-raw-infringement-log.dto';
import { createReducer } from '@ngrx/store';

export interface RawInfringementLogState extends GeneralEntityState<RawInfringementLog> {}

export const rawInfringementLogEntityAdapter: EntityAdapter<RawInfringementLog> = createEntityAdapter<RawInfringementLog>({ selectId: (rawInfringementLog) => rawInfringementLog.rawInfringementId });

export const initialRawInfringementLogState: RawInfringementLogState = rawInfringementLogEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectRawInfringementLogFeatureState = (state) => state.rawInfringementLog;
export const rawInfringementLogNgrxHelper = new GeneralEntityNGRX<RawInfringementLog, CreateRawInfringementLogDto, UpdateRawInfringementLogDto, RawInfringementLogState>('RawInfringementLog', selectRawInfringementLogFeatureState, rawInfringementLogEntityAdapter);

export const rawInfringementLogReducer = createReducer(initialRawInfringementLogState, ...rawInfringementLogNgrxHelper.reducerOns);

export function reducer(state = initialRawInfringementLogState, action): RawInfringementLogState {
    return rawInfringementLogReducer(state, action);
}
