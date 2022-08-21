import { createSelector } from '@ngrx/store';
import { HomeReportingState } from '@modules/home/ngrx/home-reporting.reducer';

const featureSelector = (state) => state.homeReporting;

export const homeReportingLoading = createSelector(featureSelector, (state: HomeReportingState) => state.loading > 0);
export const homeReportingData = createSelector(featureSelector, (state: HomeReportingState) => state.manipulatedHomeReportingData);
export const homeReportingDates = createSelector(featureSelector, (state: HomeReportingState) => state.selectedDates);
