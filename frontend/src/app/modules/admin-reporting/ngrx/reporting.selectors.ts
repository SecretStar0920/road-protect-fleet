import { createSelector } from '@ngrx/store';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';

const featureSelector = (state) => state.reporting;

export const vehicleReportingData = createSelector(featureSelector, (state: ReportingState) => state.vehicleReportingData);

export const summaryReportingData = createSelector(featureSelector, (state: ReportingState) => state.summaryReportingData);

export const infringementStatusReportingData = createSelector(
    featureSelector,
    (state: ReportingState) => state.infringementStatusReportingData,
);

export const issuerInfringementsReportingData = createSelector(
    featureSelector,
    (state: ReportingState) => state.issuerInfringementsReportingData,
);

export const infringementsDueReportingData = createSelector(
    featureSelector,
    (state: ReportingState) => state.infringementsDueReportingData,
);
