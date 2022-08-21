import { logEntityAdapter, selectLogFeatureState } from '@modules/log/ngrx/log.reducer';
import { createSelector } from '@ngrx/store';
import { LogHistory } from '@modules/shared/models/entities/log-history.model';
import { LogPriority } from '@modules/shared/models/entities/log.model';

export const { selectIds, selectEntities, selectAll, selectTotal } = logEntityAdapter.getSelectors(selectLogFeatureState);

export const getHighPriorityLogs = createSelector(selectAll, (logs: LogHistory[]) =>
    logs.filter((log) => log.priority === LogPriority.High),
);

export const areLogsLoaded = createSelector(selectLogFeatureState, (state) => state.loadedLogs);
