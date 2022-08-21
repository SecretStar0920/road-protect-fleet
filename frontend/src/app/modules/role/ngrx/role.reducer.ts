import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Role } from '@modules/shared/models/entities/role.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { createReducer } from '@ngrx/store';
import { CreateRoleDto } from '@modules/role/services/create-role.dto';
import { UpdateRoleDto } from '@modules/role/services/update-role.dto';

export interface RoleState extends GeneralEntityState<Role> {
    // additional entities state properties
}

export const roleEntityAdapter: EntityAdapter<Role> = createEntityAdapter<Role>({ selectId: (role) => role.roleId });

export const initialRoleState: RoleState = roleEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});
export const selectRoleFeatureState = (state) => state.role;
export const roleNgrxHelper = new GeneralEntityNGRX<Role, CreateRoleDto, UpdateRoleDto, RoleState>(
    'Role',
    selectRoleFeatureState,
    roleEntityAdapter,
);

export const roleReducer = createReducer(initialRoleState, ...roleNgrxHelper.reducerOns);

export function reducer(state = initialRoleState, action): RoleState {
    return roleReducer(state, action);
}
