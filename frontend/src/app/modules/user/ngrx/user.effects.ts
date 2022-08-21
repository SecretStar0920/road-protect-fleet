import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { LogService } from '@modules/log/services/log.service';
import { userNgrxHelper } from '@modules/user/ngrx/user.reducer';
@Injectable()
export class UserEffects {
    triggerLogsRefresh = createEffect(() => {
        return this.actions$.pipe(
            ofType(userNgrxHelper.updateOne),
            mergeMap((action) => {
                return this.logService.getLogsAndHistoryRefresh({ userId: action.item.changes.userId });
            }),
        );
    });

    constructor(private actions$: Actions, private logService: LogService) {}
}
