import { createSelector } from '@ngrx/store';
import { documentEntityAdapter, selectDocumentFeatureState } from '@modules/document/ngrx/document.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = documentEntityAdapter.getSelectors(selectDocumentFeatureState);
export const getDocumentById = (documentId: number) => {
    return createSelector(selectEntities, (documentEntities) => documentEntities[documentId]);
};
