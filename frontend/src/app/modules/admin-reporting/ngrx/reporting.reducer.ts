import {
    loadInfringementsDueReportingAction,
    loadInfringementStatusReportingAction,
    loadIssuerInfringementsReportingAction,
    loadSummaryReportingAction,
    loadVehicleReportingAction,
} from './reporting.actions';
import { MultiSeries, SingleSeries } from '@swimlane/ngx-charts';
import { createReducer, on } from '@ngrx/store';

export interface ReportingState {
    summaryReportingData: SingleSeries;
    vehicleReportingData: SingleSeries;
    infringementStatusReportingData: SingleSeries;
    issuerInfringementsReportingData: MultiSeries;
    infringementsDueReportingData: MultiSeries;
}

export const initialState: ReportingState = {
    summaryReportingData: undefined,
    vehicleReportingData: undefined,
    infringementStatusReportingData: undefined,
    issuerInfringementsReportingData: undefined,
    infringementsDueReportingData: undefined,
};

export const reportingReducer = createReducer(
    initialState,
    on(loadInfringementsDueReportingAction, (state, action) => {
        return {
            ...state,
            infringementsDueReportingData: action.data,
        };
    }),
    on(loadIssuerInfringementsReportingAction, (state, action) => {
        return {
            ...state,
            issuerInfringementsReportingData: action.data,
        };
    }),
    on(loadInfringementStatusReportingAction, (state, action) => {
        return {
            ...state,
            infringementStatusReportingData: action.data,
        };
    }),
    on(loadSummaryReportingAction, (state, action) => {
        return {
            ...state,
            summaryReportingData: action.data,
        };
    }),
    on(loadVehicleReportingAction, (state, action) => {
        return {
            ...state,
            vehicleReportingData: action.data,
        };
    }),
);

export function reducer(state = initialState, action): ReportingState {
    return reportingReducer(state, action);
}
