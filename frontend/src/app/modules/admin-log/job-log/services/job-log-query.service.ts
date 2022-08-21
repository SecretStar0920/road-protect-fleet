import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jobLogNgrxHelper, JobLogState } from '@modules/admin-log/job-log/ngrx/job-log.reducer';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { JobLog } from '@modules/shared/models/entities/job-log.model';
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
export class JobLogQueryService extends ApiQueryService<JobLog> {
    constructor(http: HttpService, private store: Store<JobLogState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<JobLog>> {
        return this.store.pipe(
            select(jobLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/job?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(JobLog, item));
                        }
                        return response;
                    }),
                    tap((jobLogPaginated) => {
                        this.store.dispatch(jobLogNgrxHelper.loadPage({ items: jobLogPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(jobLogNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/job/spreadsheet?${query}`, columns);
            }),
        );
    }
}
