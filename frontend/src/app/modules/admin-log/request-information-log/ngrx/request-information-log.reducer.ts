import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { createReducer } from '@ngrx/store';
import { CreateRequestInformationLogDto } from '@modules/admin-log/request-information-log/services/create-request-information-log.dto';
import { UpdateRequestInformationLogDto } from '@modules/admin-log/request-information-log/services/update-request-information-log.dto';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';

export interface RequestInformationLogState extends GeneralEntityState<RequestInformationLog> {}

export const requestInformationLogEntityAdapter: EntityAdapter<RequestInformationLog> = createEntityAdapter<RequestInformationLog>({
    selectId: (requestInformationLog) => requestInformationLog.requestInformationLogId,
});

export const initialRequestInformationLogState: RequestInformationLogState = requestInformationLogEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectRequestInformationLogFeatureState = (state) => state.requestInformationLog;
export const requestInformationLogNgrxHelper = new GeneralEntityNGRX<
    RequestInformationLog,
    CreateRequestInformationLogDto,
    UpdateRequestInformationLogDto,
    RequestInformationLogState
>('RequestInformationLog', selectRequestInformationLogFeatureState, requestInformationLogEntityAdapter);

export const requestInformationLogReducer = createReducer(initialRequestInformationLogState, ...requestInformationLogNgrxHelper.reducerOns);

export function reducer(state = initialRequestInformationLogState, action): RequestInformationLogState {
    return requestInformationLogReducer(state, action);
}
