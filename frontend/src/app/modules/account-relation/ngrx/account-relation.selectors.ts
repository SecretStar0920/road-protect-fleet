import { adapter, selectAccountRelationFeatureState } from '@modules/account-relation/ngrx/account-relation.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectAccountRelationFeatureState);
