import { Action, createReducer, on } from '@ngrx/store';
import * as HomeReportingActions from './home-reporting.actions';
import { HomeReportingDataDto } from '@modules/home/services/home-reporting.service';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';

export const homeReportingFeatureKey = 'homeReporting';

export interface HomeReportingState {
    loading: number;
    homeReportingData: HomeReportingDataDto;
    manipulatedHomeReportingData: HomeReportingDataDto;
    selectedDates: DateRangeDto;
}

export const initialState: HomeReportingState = {
    loading: 0,
    homeReportingData: undefined,
    manipulatedHomeReportingData: undefined,
    selectedDates: undefined,
};

const homeReportingReducer = createReducer(
    initialState,

    on(HomeReportingActions.getHomeReportingData.request, (state, action) => {
        return { ...state, loading: state.loading + 1 };
    }),
    on(HomeReportingActions.getHomeReportingData.success, (state, action) => {
        return { ...state, loading: state.loading - 1, homeReportingData: action.result };
    }),
    on(HomeReportingActions.getHomeReportingData.failure, (state, action) => {
        return { ...state, loading: state.loading - 1 };
    }),

    on(HomeReportingActions.setManipulatedData, (state, action) => {
        return { ...state, manipulatedHomeReportingData: action.data };
    }),

    on(HomeReportingActions.setHomeReportingDates, (state, action) => {
        return { ...state, selectedDates: action.dates };
    }),
);

export function reducer(state: HomeReportingState | undefined, action: Action) {
    return homeReportingReducer(state, action);
}
