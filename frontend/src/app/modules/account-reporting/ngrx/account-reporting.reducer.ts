import { Action, createReducer, on } from '@ngrx/store';
import * as AccountReportingActions from './account-reporting.actions';
import { MultiSeries, SingleSeries } from '@swimlane/ngx-charts';
import { MetabaseItemDetailsArray } from '@modules/shared/dtos/reporting-data.dto';

export const accountReportingFeatureKey = 'accountReporting';

export interface AccountReportingState {
    loading: number;
    accountSummary: SingleSeries;
    vehicleCounts: SingleSeries;
    leadingVehicles: SingleSeries;
    infringementAmounts: SingleSeries;
    infringementCounts: MultiSeries;
    metabaseItems: MetabaseItemDetailsArray;
    metabaseKpi: MetabaseItemDetailsArray;
}

export const initialState: AccountReportingState = {
    loading: 0,
    accountSummary: [],
    vehicleCounts: [],
    leadingVehicles: [],
    infringementCounts: [],
    infringementAmounts: [],
    metabaseItems: [],
    metabaseKpi: [],
};

const accountReportingReducer = createReducer(
    initialState,

    on(AccountReportingActions.getAccountSummary.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getAccountSummary.success, (state, action) => {
        return { ...state, loading: state.loading - 1, accountSummary: action.result };
    }),
    on(AccountReportingActions.getAccountSummary.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(AccountReportingActions.getVehicleCounts.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getVehicleCounts.success, (state, action) => {
        return { ...state, loading: state.loading - 1, vehicleCounts: action.result };
    }),
    on(AccountReportingActions.getVehicleCounts.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(AccountReportingActions.getInfringementCounts.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getInfringementCounts.success, (state, action) => {
        return { ...state, loading: state.loading - 1, infringementCounts: action.result };
    }),
    on(AccountReportingActions.getInfringementCounts.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(AccountReportingActions.getInfringementAmounts.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getInfringementAmounts.success, (state, action) => {
        return { ...state, loading: state.loading - 1, infringementAmounts: action.result };
    }),
    on(AccountReportingActions.getInfringementAmounts.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(AccountReportingActions.getLeadingVehicles.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getLeadingVehicles.success, (state, action) => {
        return { ...state, loading: state.loading - 1, leadingVehicles: action.result };
    }),
    on(AccountReportingActions.getLeadingVehicles.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(AccountReportingActions.getMetabaseItemDetails.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getMetabaseItemDetails.success, (state, action) => {
        return { ...state, loading: state.loading - 1, metabaseItems: action.result };
    }),
    on(AccountReportingActions.getMetabaseItemDetails.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(AccountReportingActions.getMetabaseKPIDetails.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(AccountReportingActions.getMetabaseKPIDetails.success, (state, action) => {
        return { ...state, loading: state.loading - 1, metabaseKpi: action.result };
    }),
    on(AccountReportingActions.getMetabaseKPIDetails.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),
);

export function reducer(state: AccountReportingState | undefined, action: Action) {
    return accountReportingReducer(state, action);
}
