import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    rawInfringementLogNgrxHelper,
    RawInfringementLogState,
} from '@modules/admin-log/raw-infringement-log/ngrx/raw-infringement-log.reducer';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { RawInfringementLog } from '@modules/shared/models/entities/raw-infringement-log.model';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpService } from '@modules/shared/services/http/http.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { select, Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RawInfringementLogQueryService extends ApiQueryService<RawInfringementLog> {
    constructor(http: HttpService, private store: Store<RawInfringementLogState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<RawInfringementLog>> {
        return this.store.pipe(
            select(rawInfringementLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/raw-infringement?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(RawInfringementLog, item));
                        }
                        return response;
                    }),
                    tap((rawInfringementLogPaginated) => {
                        this.store.dispatch(rawInfringementLogNgrxHelper.loadPage({ items: rawInfringementLogPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(rawInfringementLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/raw-infringement/spreadsheet?${query}`, columns);
            }),
        );
    }
}
