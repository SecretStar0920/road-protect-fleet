import { createSelector } from '@ngrx/store';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';

const featureSelector = (state) => state.accountReporting;

export const accountReportingLoading = createSelector(featureSelector, (state: AccountReportingState) => state.loading > 0);

export const accountSummaryData = createSelector(featureSelector, (state: AccountReportingState) => state.accountSummary);

export const vehicleCountData = createSelector(featureSelector, (state: AccountReportingState) => state.vehicleCounts);

export const leadingVehiclesData = createSelector(featureSelector, (state: AccountReportingState) => state.leadingVehicles);

export const infringementCountData = createSelector(featureSelector, (state: AccountReportingState) => state.infringementCounts);

export const infringementAmountData = createSelector(featureSelector, (state: AccountReportingState) => state.infringementAmounts);

export const metabaseItemsData = createSelector(featureSelector, (state: AccountReportingState) => state.metabaseItems);

export const metabaseKpiData = createSelector(featureSelector, (state: AccountReportingState) => state.metabaseKpi);
