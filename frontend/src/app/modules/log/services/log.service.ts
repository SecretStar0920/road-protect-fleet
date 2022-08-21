import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Log } from '@modules/shared/models/entities/log.model';
import { Store } from '@ngrx/store';
import { logNgrxHelper, LogState } from '@modules/log/ngrx/log.reducer';
import { plainToClass } from 'class-transformer';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { isNil } from 'lodash';
import { LogHistory } from '@modules/shared/models/entities/log-history.model';
import { EMPTY } from 'rxjs';

export interface GetLogsParameters {
    vehicleId?: number;
    accountId?: number;
    userId?: number;
    infringementId?: number;
}

@Injectable({
    providedIn: 'root',
})
export class LogService {
    constructor(private http: HttpService, private store: Store<LogState>) {}

    getLogs({ vehicleId, accountId, userId, infringementId }: GetLogsParameters) {
        const query = RequestQueryBuilder.create()
            .setLimit(100)
            .sortBy({ field: 'createdAt', order: 'DESC' })
            .setJoin({ field: 'vehicle' })
            .setJoin({ field: 'account' })
            .setJoin({ field: 'user' })
            .setJoin({ field: 'infringement' });

        if (!isNil(vehicleId)) {
            query.setFilter({ field: 'vehicle.vehicleId', operator: CondOperator.EQUALS, value: vehicleId });
        }
        if (!isNil(accountId)) {
            query.setFilter({ field: 'account.accountId', operator: CondOperator.EQUALS, value: accountId });
        }
        if (!isNil(userId)) {
            query.setFilter({ field: 'user.userId', operator: CondOperator.EQUALS, value: userId });
        }
        if (!isNil(infringementId)) {
            query.setFilter({ field: 'infringement.infringementId', operator: CondOperator.EQUALS, value: infringementId });
        }

        return this.http.getSecure(`log?${query.query()}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Log, item));
                }
                return [];
            }),
            tap((logs) => {
                this.store.dispatch(logNgrxHelper.load({ items: logs }));
            }),
        );
    }

    getLogsAndHistory(logParameters: GetLogsParameters) {
        return this.http.putSecure(`log`, logParameters);
    }
    getLogsAndHistoryRefresh(logParameters: GetLogsParameters) {
        return this.http.putSecure(`log`, logParameters).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(LogHistory, item));
                }
                return [];
            }),
            tap((logs) => {
                this.store.dispatch(logNgrxHelper.load({ items: logs }));
            }),
            map((logs) => {
                return logNgrxHelper.load({ items: logs });
            }),
            catchError(() => EMPTY),
        );
    }
}
