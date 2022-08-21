import { createSelector } from '@ngrx/store';

const globalLoadingFeature = (state) => state.globalLoading;

export const getTotalRequests = createSelector(globalLoadingFeature, (state) => state.totalRequests);

export const getCompletedRequests = createSelector(globalLoadingFeature, (state) => state.totalRequestsCompleted);

export const getInProgressCount = createSelector(getTotalRequests, getCompletedRequests, (total, completed) => total - completed);

export const isHttpLoading = createSelector(getInProgressCount, (count) => count > 0);
