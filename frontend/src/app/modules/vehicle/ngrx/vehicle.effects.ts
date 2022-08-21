import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { LogService } from '@modules/log/services/log.service';
import { vehicleNgrxHelper } from '@modules/vehicle/ngrx/vehicle.reducer';

@Injectable()
export class VehicleEffects {
    constructor(private logService: LogService, private actions$: Actions) {}

    triggerLogsRefresh = createEffect(() => {
        return this.actions$.pipe(
            ofType(vehicleNgrxHelper.updateOne),
            mergeMap((action) => {
                return this.logService.getLogsAndHistoryRefresh({ vehicleId: action.item.changes.vehicleId });
            }),
        );
    });
}
