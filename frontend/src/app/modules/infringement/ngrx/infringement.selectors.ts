import { infringementNgrxHelper, InfringementState, selectInfringementFeatureState } from '@modules/infringement/ngrx/infringement.reducer';
import { createSelector } from '@ngrx/store';

export const { selectIds, selectEntities, selectAll, selectTotal } = infringementNgrxHelper.entitySelectors;

export const infringementIsLoading = createSelector(
    selectInfringementFeatureState,
    (state: InfringementState) => state.infringementLoading > 0,
);

export const infringementQueryParameters = createSelector(selectInfringementFeatureState, (state: InfringementState) => state.queryParams);

// Admin Infringement Uploads
export const adminInfringementUpload = createSelector(selectInfringementFeatureState, (state: InfringementState) => state.adminUpload);
export const adminInfringementUploadIssuer = createSelector(adminInfringementUpload, (state) => state.issuers);
export const adminInfringementUploadAccount = createSelector(adminInfringementUpload, (state) => state.account);
export const adminInfringementUploadUploadResponse = createSelector(adminInfringementUpload, (state) => state.uploadResponse);
export const adminInfringementUploadMissingInfringements = createSelector(
    adminInfringementUploadUploadResponse,
    (state) => state.missingInfringements,
);

export const adminInfringementUploadMissingInfringementView = createSelector(
    adminInfringementUpload,
    (state) => state.missingInfringements,
);
export const adminInfringementUploadMissingInfringementLoading = createSelector(
    adminInfringementUploadMissingInfringementView,
    (state) => state.loading,
);
export const adminInfringementUploadMissingInfringementResponse = createSelector(
    adminInfringementUploadMissingInfringementView,
    (state) => state.submitResponse,
);
export const adminInfringementUploadMissingSkipRedirections = createSelector(
    adminInfringementUploadMissingInfringementView,
    (state) => state.skipRedirections,
);
