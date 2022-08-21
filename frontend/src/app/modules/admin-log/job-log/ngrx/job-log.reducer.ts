import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { JobLog } from '@modules/shared/models/entities/job-log.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateJobLogDto } from '@modules/admin-log/job-log/services/create-job-log.dto';
import { UpdateJobLogDto } from '@modules/admin-log/job-log/services/update-job-log.dto';
import { createReducer } from '@ngrx/store';

export interface JobLogState extends GeneralEntityState<JobLog> {}

export const jobLogEntityAdapter: EntityAdapter<JobLog> = createEntityAdapter<JobLog>({ selectId: (jobLog) => jobLog.uuid });

export const initialJobLogState: JobLogState = jobLogEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectJobLogFeatureState = (state) => state.jobLog;
export const jobLogNgrxHelper = new GeneralEntityNGRX<JobLog, CreateJobLogDto, UpdateJobLogDto, JobLogState>(
    'JobLog',
    selectJobLogFeatureState,
    jobLogEntityAdapter,
);

export const jobLogReducer = createReducer(initialJobLogState, ...jobLogNgrxHelper.reducerOns);

export function reducer(state = initialJobLogState, action): JobLogState {
    return jobLogReducer(state, action);
}
