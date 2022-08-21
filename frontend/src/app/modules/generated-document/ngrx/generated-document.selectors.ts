import {
    generatedDocumentEntityAdapter,
    selectGeneratedDocumentFeatureState,
} from '@modules/generated-document/ngrx/generated-document.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = generatedDocumentEntityAdapter.getSelectors(
    selectGeneratedDocumentFeatureState,
);
