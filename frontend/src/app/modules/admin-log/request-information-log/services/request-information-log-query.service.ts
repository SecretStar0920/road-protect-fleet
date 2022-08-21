import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import {
    requestInformationLogNgrxHelper,
    RequestInformationLogState,
} from '@modules/admin-log/request-information-log/ngrx/request-information-log.reducer';

@Injectable({
    providedIn: 'root',
})
export class RequestInformationLogQueryService extends ApiQueryService<RequestInformationLog> {
    constructor(http: HttpService, private store: Store<RequestInformationLogState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<RequestInformationLog>> {
        return this.store.pipe(
            select(requestInformationLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/request-information-log?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(RequestInformationLog, item));
                        }
                        return response;
                    }),
                    tap((requestInformationLogPaginated) => {
                        this.store.dispatch(requestInformationLogNgrxHelper.loadPage({ items: requestInformationLogPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(requestInformationLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/request-information-log/spreadsheet?${query}`, columns);
            }),
        );
    }
}
