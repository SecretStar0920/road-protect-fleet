import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';

const graphingSelector = createFeatureSelector('graphing');

export const dateRange = createSelector(graphingSelector, (state: GraphingState) => state.dateRange);
export const isComparisonLoading = createSelector(graphingSelector, (state: GraphingState) => state.isComparisonLoading);
export const isGraphLoading = createSelector(graphingSelector, (state: GraphingState) => state.isGraphLoading);
export const selectedEndpoint = createSelector(graphingSelector, (state: GraphingState) => state.selectedEndpoint);
export const byStatus = createSelector(graphingSelector, (state: GraphingState) => state.byStatus);
export const byStatusMappedData = createSelector(graphingSelector, (state: GraphingState) => state.byStatusMappedData);
export const showPreviousYearComparison = createSelector(graphingSelector, (state: GraphingState) => state.showPreviousYearComparison);
export const showOther = createSelector(graphingSelector, (state: GraphingState) => state.showOther);
export const issuersToExclude = createSelector(graphingSelector, (state: GraphingState) => state.issuersToExclude);

export const byIssuerMappedData = createSelector(graphingSelector, (state: GraphingState) => state.byIssuerMappedData);
export const byIssuerLineGraphData = createSelector(graphingSelector, (state: GraphingState) => state.issuerLineGraphData);
export const byIssuerBarGraphData = createSelector(graphingSelector, (state: GraphingState) => state.issuerBarGraphData);
export const byVehicleBarGraphData = createSelector(graphingSelector, (state: GraphingState) => state.vehicleBarGraphData);
export const byVehicleTotals = createSelector(graphingSelector, (state: GraphingState) => state.vehicleTotals);
export const byIssuerTableData = createSelector(graphingSelector, (state: GraphingState) => state.issuerTableData);
export const byIssuerOtherTableData = createSelector(graphingSelector, (state: GraphingState) => state.otherIssuerTableData);
export const byIssuerOtherLineGraphData = createSelector(graphingSelector, (state: GraphingState) => state.otherIssuerLineGraphData);
export const byIssuerOtherBarGraphData = createSelector(graphingSelector, (state: GraphingState) => state.otherIssuerBarGraphData);
export const byIssuerTotals = createSelector(graphingSelector, (state: GraphingState) => state.issuerTotals);
export const byIssuerOtherIssuersPerDateRange = createSelector(graphingSelector, (state: GraphingState) => state.otherIssuersPerDateRange);
export const byIssuerTranslatedData = createSelector(graphingSelector, (state: GraphingState) => state.translatedData);
export const byIssuerMappedTableData = createSelector(graphingSelector, (state: GraphingState) => state.issuerMappedTableData);
export const byVehicleMappedTableData = createSelector(graphingSelector, (state: GraphingState) => state.vehicleMappedTableData);
export const byIssuerNumber = createSelector(graphingSelector, (state: GraphingState) => state.groupedIssuers);
export const byVehicleNumber = createSelector(graphingSelector, (state: GraphingState) => state.vehicleNumber);
export const byIssuerPreviousYear = createSelector(graphingSelector, (state: GraphingState) => state.byIssuerPreviousYear);
export const byIssuerPreviousYearMappedData = createSelector(
    graphingSelector,
    (state: GraphingState) => state.byIssuerPreviousYearMappedData,
);
export const byIssuerUniqueKeys = createSelector(graphingSelector, (state: GraphingState) => state.byIssuerUniqueKeys);

export const byVehiclePreviousYearMappedData = createSelector(
    graphingSelector,
    (state: GraphingState) => state.byVehiclePreviousYearMappedData,
);
export const byStatusPreviousYearMappedData = createSelector(
    graphingSelector,
    (state: GraphingState) => state.byStatusPreviousYearMappedData,
);
export const selectedParameters = createSelector(graphingSelector, (state: GraphingState) => state.selectedParameters);
export const byVehicle = createSelector(graphingSelector, (state: GraphingState) => state.byVehicle);
export const byVehicleMappedData = createSelector(graphingSelector, (state: GraphingState) => state.byVehicleMappedData);
export const byVehicleTableData = createSelector(graphingSelector, (state: GraphingState) => state.vehicleTableData);
export const triggerInfringementView = createSelector(graphingSelector, (state: GraphingState) => state.triggerInfringementViewCount);
export const byVehicleUniqueKeys = createSelector(graphingSelector, (state: GraphingState) => state.byVehicleUniqueKeys);
