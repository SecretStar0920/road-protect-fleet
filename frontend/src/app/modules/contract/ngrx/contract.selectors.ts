import { createSelector } from '@ngrx/store';
import { contractEntityAdapter, ContractState, selectContractFeatureState } from '@modules/contract/ngrx/contract.reducer';

export const { selectIds, selectEntities, selectAll, selectTotal } = contractEntityAdapter.getSelectors(selectContractFeatureState);

export const getContractByVehicleId = (vehicleId: number) => {
    return createSelector(selectAll, (contracts) => {
        return contracts.filter((contract) => {
            return contract.vehicle.vehicleId === vehicleId;
        });
    });
};

export const contractIsLoading = createSelector(selectContractFeatureState, (state: ContractState) => state.contractLoading > 0);

export const getContractById = (contractId: number) => {
    return createSelector(selectEntities, (contractEntities) => contractEntities[contractId]);
};
