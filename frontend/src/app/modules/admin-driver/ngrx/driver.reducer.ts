import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { createReducer } from '@ngrx/store';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { UpdateDriverDto } from '@modules/admin-driver/services/update-driver.dto';
import { CreateDriverDto } from '@modules/admin-driver/services/create-driver.dto';

export interface DriverState extends GeneralEntityState<Driver> {}

export const driverEntityAdapter: EntityAdapter<Driver> = createEntityAdapter<Driver>({
    selectId: (driver) => driver.driverId,
});

export const initialDriverState: DriverState = driverEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});

export const selectDriverFeatureState = (state) => state.driver;
export const driverNgrxHelper = new GeneralEntityNGRX<Driver, CreateDriverDto, UpdateDriverDto, DriverState>(
    'Driver',
    selectDriverFeatureState,
    driverEntityAdapter,
);

export const driverReducer = createReducer(initialDriverState, ...driverNgrxHelper.reducerOns);

export function reducer(state = initialDriverState, action): DriverState {
    return driverReducer(state, action);
}
