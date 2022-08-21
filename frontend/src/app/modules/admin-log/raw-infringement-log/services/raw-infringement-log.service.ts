import { Injectable } from '@angular/core';
import {
    rawInfringementLogNgrxHelper,
    RawInfringementLogState,
} from '@modules/admin-log/raw-infringement-log/ngrx/raw-infringement-log.reducer';
import { RawInfringementLog } from '@modules/shared/models/entities/raw-infringement-log.model';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RawInfringementLogService {
    constructor(private http: HttpService, private store: Store<RawInfringementLogState>) {}

    getAllRawInfringementLogs() {
        return this.http.getSecure('rawInfringementLog').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(RawInfringementLog, item));
                }
                return [];
            }),
            tap((rawInfringementLogs) => {
                this.store.dispatch(rawInfringementLogNgrxHelper.load({ items: rawInfringementLogs }));
            }),
        );
    }

    getRawInfringementLog(rawInfringementLogId: number) {
        return this.http.getSecure(`raw-infringement/${rawInfringementLogId}`).pipe(
            map((response: object) => {
                return plainToClass(RawInfringementLog, response);
            }),
            tap((rawInfringementLog) => {
                this.store.dispatch(rawInfringementLogNgrxHelper.upsertOne({ item: rawInfringementLog }));
            }),
        );
    }
}
