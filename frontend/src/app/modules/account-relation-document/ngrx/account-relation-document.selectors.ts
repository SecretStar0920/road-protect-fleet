import { createSelector } from '@ngrx/store';
import { adapter } from '@modules/account-relation-document/ngrx/account-relation-document.reducer';

export const selectAccountRelationDocumentFeatureState = (state) => state.accountRelationDocument;
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectAccountRelationDocumentFeatureState);

export const getAccountRelationDocumentById = (accountRelationDocumentId: number) => {
    return createSelector(selectEntities, (accountRelationDocumentEntities) => accountRelationDocumentEntities[accountRelationDocumentId]);
};

export const getAccountRelationDocumentsByRelationId = (accountRelationId: number) => {
    return createSelector(selectAll, (accountRelationDocumentEntities) =>
        accountRelationDocumentEntities.filter((doc) => doc.relation.accountRelationId === accountRelationId),
    );
};
