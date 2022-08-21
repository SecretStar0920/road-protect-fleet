import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateVehicleDto } from '@modules/vehicle/services/create-vehicle.dto';
import { UpdateVehicleDto } from '@modules/vehicle/services/update-vehicle.dto';
import { createReducer, on } from '@ngrx/store';
import { resetVehicleQueryParams } from '@modules/vehicle/ngrx/vehicle.actions';

export interface VehicleState extends GeneralEntityState<Vehicle> {
    // additional entities state properties
}

export const selectVehicleFeatureState = (state) => state.vehicle;
export const vehicleEntityAdapter: EntityAdapter<Vehicle> = createEntityAdapter<Vehicle>({ selectId: (vehicle) => vehicle.vehicleId });

export const initialVehicleState: VehicleState = vehicleEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {
        graphing: false,
        startDate: undefined,
        endDate: undefined,
        mine: false,
    },
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const vehicleNgrxHelper = new GeneralEntityNGRX<Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleState>(
    'Vehicle',
    selectVehicleFeatureState,
    vehicleEntityAdapter,
);

export const vehicleReducer = createReducer(
    initialVehicleState,
    ...vehicleNgrxHelper.reducerOns,
    on(resetVehicleQueryParams, (state, action) => {
        return { ...state, queryParams: initialVehicleState.queryParams };
    }),
);

export function reducer(state = initialVehicleState, action): VehicleState {
    return vehicleReducer(state, action);
}
