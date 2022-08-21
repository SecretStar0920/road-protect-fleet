import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { IntegrationRequestLog } from '@modules/shared/models/entities/integration-request-log.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { integrationRequestLogNgrxHelper, IntegrationRequestLogState } from '@modules/admin-log/integration-request-log/ngrx/integration-request-log.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class IntegrationRequestLogQueryService extends ApiQueryService<IntegrationRequestLog> {
    constructor(http: HttpService, private store: Store<IntegrationRequestLogState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<IntegrationRequestLog>> {
        return this.store.pipe(
            select(integrationRequestLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/integration-request-log?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(IntegrationRequestLog, item));
                        }
                        return response;
                    }),
                    tap((integrationRequestLogPaginated) => {
                        this.store.dispatch(integrationRequestLogNgrxHelper.loadPage({ items: integrationRequestLogPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(integrationRequestLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/integration-request-log/spreadsheet?${query}`, columns);
            }),
        );
    }
}
