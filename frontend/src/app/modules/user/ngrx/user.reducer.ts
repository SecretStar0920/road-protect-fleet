import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { User } from '@modules/shared/models/entities/user.model';
import { createReducer } from '@ngrx/store';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateUserDto, UpdateUserDto } from '@modules/user/services/user.service';

export interface UserState extends GeneralEntityState<User> {
    // additional entities state properties
}

export const selectUserFeatureState = (state) => state.user;
export const userEntityAdapter: EntityAdapter<User> = createEntityAdapter<User>({ selectId: (user) => user.userId });

export const initialUserState: UserState = userEntityAdapter.getInitialState({
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    queryParams: {},
});

export const userNgrxHelper = new GeneralEntityNGRX<User, CreateUserDto, UpdateUserDto, UserState>(
    'User',
    selectUserFeatureState,
    userEntityAdapter,
);

export const userReducer = createReducer(initialUserState, ...userNgrxHelper.reducerOns);

export function reducer(state = initialUserState, action): UserState {
    return userReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = userEntityAdapter.getSelectors(selectUserFeatureState);
