import { roleEntityAdapter } from '@modules/role/ngrx/role.reducer';

export const selectRoleFeatureState = (state) => state.role;
export const { selectIds, selectEntities, selectAll, selectTotal } = roleEntityAdapter.getSelectors(selectRoleFeatureState);
