import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Log } from '@modules/shared/models/entities/log.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateLogDto } from '@modules/log/services/create-log.dto';
import { UpdateLogDto } from '@modules/log/services/update-log.dto';
import * as LogActions from '@modules/log/ngrx/log.actions';
import { createReducer, on } from '@ngrx/store';
import { LogHistory } from '@modules/shared/models/entities/log-history.model';

export interface LogState extends GeneralEntityState<Log> {
    // additional entities state properties
    loadedLogs: boolean;
}

export const logEntityAdapter: EntityAdapter<LogHistory> = createEntityAdapter<LogHistory>({ selectId: (log) => log.logId });

export const initialLogState: LogState = logEntityAdapter.getInitialState({
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    loadedLogs: false,
});
export const selectLogFeatureState = (state) => state.log;
export const logNgrxHelper = new GeneralEntityNGRX<LogHistory, CreateLogDto, UpdateLogDto, LogState>(
    'Log',
    selectLogFeatureState,
    logEntityAdapter,
);

export const logReducer = createReducer(
    initialLogState,
    ...logNgrxHelper.reducerOns,
    on(LogActions.setLogLoadedState, (state, action) => ({ ...state, loadedLogs: action.newState })),
    on(logNgrxHelper.load, (state, action) => logEntityAdapter.setAll(action.items, { ...state, loadedLogs: true })),
);

export function reducer(state = initialLogState, action): LogState {
    return logReducer(state, action);
}
