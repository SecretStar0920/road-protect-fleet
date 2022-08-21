import { selectStreetFeatureState, streetEntityAdapter } from '@modules/street/ngrx/street.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = streetEntityAdapter.getSelectors(selectStreetFeatureState);
