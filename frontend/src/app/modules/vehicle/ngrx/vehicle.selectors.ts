import { selectVehicleFeatureState, vehicleEntityAdapter, VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { createSelector } from '@ngrx/store';

export const { selectIds, selectEntities, selectAll, selectTotal } = vehicleEntityAdapter.getSelectors(selectVehicleFeatureState);

export const vehicleQueryParameters = createSelector(selectVehicleFeatureState, (state: VehicleState) => state.queryParams);
