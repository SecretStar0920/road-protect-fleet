import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, concatMap, map } from 'rxjs/operators';
import * as LogActions from '@modules/log/ngrx/log.actions';
import { GetLogsParameters, LogService } from '@modules/log/services/log.service';
import { of } from 'rxjs';
import { logNgrxHelper } from '@modules/log/ngrx/log.reducer';

@Injectable()
export class LogEffects {
    constructor(private actions$: Actions, private router: Router, private logService: LogService) {}

    loadLogs = createEffect(() => {
        return this.actions$.pipe(
            ofType(LogActions.requestLogs),
            concatMap((action) => {
                const params: GetLogsParameters = {
                    vehicleId: action.vehicleId ? action.vehicleId : null,
                    userId: action.userId ? action.userId : null,
                    accountId: action.accountId ? action.accountId : null,
                    infringementId: action.infringementId ? action.infringementId : null,
                };
                return this.logService.getLogsAndHistory(params).pipe(
                    map((logs) => {
                        return logNgrxHelper.load({ items: logs });
                    }),
                    catchError((error) => of(LogActions.setLogLoadedState({ newState: false }))),
                );
            }),
        );
    });

    clearLogs = createEffect(() => {
        return this.actions$.pipe(
            ofType(LogActions.setLogLoadedState),
            map((action) => {
                if (!action.newState) {
                    return logNgrxHelper.clear();
                }
            }),
        );
    });
}
