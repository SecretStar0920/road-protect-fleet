import { Action, createReducer } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateAccountRelationDto } from '@modules/account-relation/services/create-account-relation.dto';
import { UpdateAccountRelationDto } from '@modules/account-relation/services/update-account-relation.dto';

export const accountRelationsFeatureKey = 'accountRelation';

export interface AccountRelationState extends GeneralEntityState<AccountRelation> {}

export const adapter: EntityAdapter<AccountRelation> = createEntityAdapter<AccountRelation>({
    selectId: (accountRelation) => accountRelation.accountRelationId,
});

export const initialState: AccountRelationState = adapter.getInitialState({
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectAccountRelationFeatureState = (state) => state.accountRelation;
export const accountRelationNgrxHelper = new GeneralEntityNGRX<
    AccountRelation,
    CreateAccountRelationDto,
    UpdateAccountRelationDto,
    AccountRelationState
>(accountRelationsFeatureKey, selectAccountRelationFeatureState, adapter);

const accountRelationReducer = createReducer(initialState, ...accountRelationNgrxHelper.reducerOns);

export function reducer(state: AccountRelationState | undefined, action: Action) {
    return accountRelationReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
