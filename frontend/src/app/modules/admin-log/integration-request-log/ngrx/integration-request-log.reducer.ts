import { CreateIntegrationRequestLogDto } from '@modules/admin-log/integration-request-log/services/create-integration-request-log.dto';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { IntegrationRequestLog } from '@modules/shared/models/entities/integration-request-log.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { UpdateIntegrationRequestLogDto } from '@modules/admin-log/integration-request-log/services/update-integration-request-log.dto';
import { createReducer } from '@ngrx/store';

export interface IntegrationRequestLogState extends GeneralEntityState<IntegrationRequestLog> {}

export const integrationRequestLogEntityAdapter: EntityAdapter<IntegrationRequestLog> = createEntityAdapter<IntegrationRequestLog>({
    selectId: (integrationRequestLog) => integrationRequestLog.integrationRequestLogId,
});

export const initialIntegrationRequestLogState: IntegrationRequestLogState = integrationRequestLogEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectIntegrationRequestLogFeatureState = (state) => state.integrationRequestLog;
export const integrationRequestLogNgrxHelper = new GeneralEntityNGRX<
    IntegrationRequestLog,
    CreateIntegrationRequestLogDto,
    UpdateIntegrationRequestLogDto,
    IntegrationRequestLogState
>('IntegrationRequestLog', selectIntegrationRequestLogFeatureState, integrationRequestLogEntityAdapter);

export const integrationRequestLogReducer = createReducer(initialIntegrationRequestLogState, ...integrationRequestLogNgrxHelper.reducerOns);

export function reducer(state = initialIntegrationRequestLogState, action): IntegrationRequestLogState {
    return integrationRequestLogReducer(state, action);
}
