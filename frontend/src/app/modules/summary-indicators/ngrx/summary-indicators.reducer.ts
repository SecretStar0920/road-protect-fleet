import { createReducer, on } from '@ngrx/store';
import {
    ComparisonSummaryIndicatorData,
    ThisYearSummaryIndicatorData,
} from '@modules/summary-indicators/services/summary-indicators.service';
import {
    clearSummaryIndicatorsData,
    requestComparisonSummaryIndicators,
    requestThisYearSummaryIndicators,
    SummaryIndicatorTypes,
    updateDateComparison,
    hideInfringementView,
    updatedInfringementView,
} from '@modules/summary-indicators/ngrx/summary-indicators.actions';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';

export interface SummaryIndicatorsState {
    loading: number;
    thisYearAccountId: number;
    comparisonAccountId: number;
    comparisonDates: SliderDateRangeDto;
    isDateComparison: boolean;
    viewInfringementTable: SummaryIndicatorTypes;
    thisYearManipulatedData: ThisYearSummaryIndicatorData;
    comparisonManipulatedData: ComparisonSummaryIndicatorData;
}

export const initialSummaryIndicatorState: SummaryIndicatorsState = {
    loading: 0,
    thisYearAccountId: undefined,
    comparisonAccountId: undefined,
    comparisonDates: undefined,
    isDateComparison: false,
    viewInfringementTable: SummaryIndicatorTypes.None,
    thisYearManipulatedData: undefined,
    comparisonManipulatedData: undefined,
};

export const summaryIndicatorReducer = createReducer(
    initialSummaryIndicatorState,
    on(updateDateComparison, (state, action) => {
        return {
            ...state,
            isDateComparison: action.isDateComparison,
        };
    }),
    on(clearSummaryIndicatorsData, (state, action) => {
        return {
            ...state,
            initialSummaryIndicatorState,
        };
    }),
    on(hideInfringementView, (state, action) => {
        return { ...state, viewInfringementTable: SummaryIndicatorTypes.None };
    }),
    on(updatedInfringementView, (state, action) => {
        return { ...state, viewInfringementTable: action.viewInfringementTable };
    }),
    on(requestThisYearSummaryIndicators.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(requestThisYearSummaryIndicators.success, (state, action) => {
        return {
            ...state,
            loading: state.loading - 1,
            thisYearManipulatedData: action.result,
            isDateComparison: false,
            thisYearAccountId: action.result.accountId,
        };
    }),
    on(requestThisYearSummaryIndicators.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),
    on(requestComparisonSummaryIndicators.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(requestComparisonSummaryIndicators.success, (state, action) => {
        return {
            ...state,
            loading: state.loading - 1,
            comparisonManipulatedData: action.result,
            isDateComparison: true,
            comparisonDates: action.result.comparisonDates,
            comparisonAccountId: action.result.accountId,
        };
    }),
    on(requestComparisonSummaryIndicators.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),
);

export const selectAccountFeatureState = (state) => state.rawData;

export function reducer(state = initialSummaryIndicatorState, action): SummaryIndicatorsState {
    return summaryIndicatorReducer(state, action);
}
