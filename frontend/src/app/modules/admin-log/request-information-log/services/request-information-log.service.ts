import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    requestInformationLogNgrxHelper,
    RequestInformationLogState,
} from '@modules/admin-log/request-information-log/ngrx/request-information-log.reducer';
import { plainToClass } from 'class-transformer';
import { CreateRequestInformationLogDto } from '@modules/admin-log/request-information-log/services/create-request-information-log.dto';
import { UpdateRequestInformationLogDto } from '@modules/admin-log/request-information-log/services/update-request-information-log.dto';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';

@Injectable({
    providedIn: 'root',
})
export class RequestInformationLogService {
    constructor(private http: HttpService, private store: Store<RequestInformationLogState>) {}

    getAllRequestInformationLogs() {
        return this.http.getSecure('requestInformationLog').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(RequestInformationLog, item));
                }
                return [];
            }),
            tap((requestInformationLogs) => {
                this.store.dispatch(requestInformationLogNgrxHelper.load({ items: requestInformationLogs }));
            }),
        );
    }

    getRequestInformationLog(requestInformationLogId: number) {
        return this.http.getSecure(`request-information-log/${requestInformationLogId}`).pipe(
            map((response: object) => {
                return plainToClass(RequestInformationLog, response);
            }),
            tap((requestInformationLog) => {
                this.store.dispatch(requestInformationLogNgrxHelper.upsertOne({ item: requestInformationLog }));
            }),
        );
    }

    sendRequestForInformation(issuerIds: (number | string)[] = []): Observable<RequestInformationLog[]> {
        return this.http.postSecure(`request-information-log/send-request`, { issuerIds }).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(RequestInformationLog, item));
                }
                return [];
            }),
            tap((result) => {
                this.store.dispatch(requestInformationLogNgrxHelper.addMany({ items: result }));
            }),
        );
    }

    updateRequestInformationLog(id: number, dto: UpdateRequestInformationLogDto): Observable<RequestInformationLog> {
        return this.http.postSecure(`request-information-log/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(RequestInformationLog, response);
            }),
            tap((result) => {
                this.store.dispatch(
                    requestInformationLogNgrxHelper.updateOne({ item: { id: result.requestInformationLogId, changes: result } }),
                );
            }),
        );
    }

    deleteRequestInformationLog(requestInformationLogId: number) {
        return this.http.deleteSecure(`request-information-log/${requestInformationLogId}`).pipe(
            map((response: object) => {
                return plainToClass(RequestInformationLog, response);
            }),
            tap((requestInformationLog) => {
                this.store.dispatch(requestInformationLogNgrxHelper.deleteOne({ id: `${requestInformationLog.requestInformationLogId}` }));
            }),
        );
    }
}
