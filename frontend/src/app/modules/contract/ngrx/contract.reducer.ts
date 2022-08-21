import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateContractDto } from '@modules/contract/services/create-contract.dto';
import { UpdateContractEndDateDto } from '@modules/contract/services/update-contract.dto';
import { createReducer, on } from '@ngrx/store';
import { initialInfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { resetContractQueryParameters, contractLoading } from './contract.actions';

export interface ContractState extends GeneralEntityState<Contract> {
    contractLoading: number;
}

export const contractEntityAdapter: EntityAdapter<Contract> = createEntityAdapter<Contract>({
    selectId: (contract) => contract.contractId,
});

export const initialContractState: ContractState = contractEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {
        mine: false,
        graphing: false,
        via: null,
        startDate: null,
        endDate: null,
    },
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    contractLoading: 0,
});

export const selectContractFeatureState = (state) => state.contract;
export const contractNgrxHelper = new GeneralEntityNGRX<Contract, CreateContractDto, UpdateContractEndDateDto, ContractState>(
    'Contract',
    selectContractFeatureState,
    contractEntityAdapter,
);

export const contractReducer = createReducer(
    initialContractState,
    ...contractNgrxHelper.reducerOns,
    on(resetContractQueryParameters, (state, action) => {
        return { ...state, queryParams: initialInfringementState.queryParams };
    }),
    on(contractLoading, (state: ContractState, action) => {
        return {
            ...state,
            contractLoading: action.loading ? state.contractLoading + 1 : state.contractLoading - 1,
        };
    }),
);

export function reducer(state = initialContractState, action): ContractState {
    return contractReducer(state, action);
}
