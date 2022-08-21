import { createAction, props } from '@ngrx/store';

export const requestLogs = createAction(
    '[View Logs] Load Logs Request',
    props<{
        vehicleId?: number;
        accountId?: number;
        userId?: number;
        infringementId?: number;
    }>(),
);

export const setLogLoadedState = createAction('[Logs Loaded Request] Update Loaded Boolean', props<{ newState: boolean }>());
