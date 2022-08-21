import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';

const summaryIndicatorsSelector = createFeatureSelector('summary-indicators');

export const getIsDateComparison = createSelector(summaryIndicatorsSelector, (state: SummaryIndicatorsState) => state.isDateComparison);

export const getThisYearAccountId = createSelector(summaryIndicatorsSelector, (state: SummaryIndicatorsState) => state.thisYearAccountId);
export const getComparisonAccountId = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.comparisonAccountId,
);

export const getComparisonDates = createSelector(summaryIndicatorsSelector, (state: SummaryIndicatorsState) => state.comparisonDates);
export const getInfringementTableShowing = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.viewInfringementTable,
);

export const summaryIndicatorLoading = createSelector(summaryIndicatorsSelector, (state: SummaryIndicatorsState) => state.loading > 0);

export const getYearComparisonData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.comparisonManipulatedData,
);
export const getThisYearData = createSelector(summaryIndicatorsSelector, (state: SummaryIndicatorsState) => state.thisYearManipulatedData);

export const getThisYearManagedVehiclesData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.thisYearManipulatedData?.manipulatedManagedVehiclesData,
);
export const getYearComparisonManagedVehiclesData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.comparisonManipulatedData?.manipulatedManagedVehiclesData,
);

export const getThisYearInfringementCostData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.thisYearManipulatedData?.manipulatedInfringementCostData,
);
export const getYearComparisonInfringementCostData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.comparisonManipulatedData?.manipulatedInfringementCostData,
);

export const getThisYearRedirectionData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.thisYearManipulatedData?.manipulatedRedirectionData,
);
export const getYearComparisonRedirectionData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.comparisonManipulatedData?.manipulatedRedirectionData,
);

export const getThisYearUnmanagedVehiclesData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.thisYearManipulatedData?.manipulatedUnmanagedVehiclesData,
);
export const getYearComparisonUnmanagedVehiclesData = createSelector(
    summaryIndicatorsSelector,
    (state: SummaryIndicatorsState) => state.comparisonManipulatedData?.manipulatedUnmanagedVehiclesData,
);
