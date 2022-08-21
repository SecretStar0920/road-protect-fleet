import { Injectable } from '@angular/core';
import {
    integrationRequestLogNgrxHelper,
    IntegrationRequestLogState,
} from '@modules/admin-log/integration-request-log/ngrx/integration-request-log.reducer';
import { IntegrationRequestLog } from '@modules/shared/models/entities/integration-request-log.model';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IntegrationRequestLogService {
    constructor(private http: HttpService, private store: Store<IntegrationRequestLogState>) {}

    getAllIntegrationRequestLogs() {
        return this.http.getSecure('integration-request-log').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(IntegrationRequestLog, item));
                }
                return [];
            }),
            tap((integrationRequestLogs) => {
                this.store.dispatch(integrationRequestLogNgrxHelper.load({ items: integrationRequestLogs }));
            }),
        );
    }

    getIntegrationRequestLog(integrationRequestLogId: number) {
        return this.http.getSecure(`integration-request-log/${integrationRequestLogId}`).pipe(
            map((response: object) => {
                return plainToClass(IntegrationRequestLog, response);
            }),
            tap((integrationRequestLog) => {
                this.store.dispatch(integrationRequestLogNgrxHelper.upsertOne({ item: integrationRequestLog }));
            }),
        );
    }
}
