import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class InfringementQueryService extends ApiQueryService<Infringement> {
    constructor(http: HttpService, private store: Store<InfringementState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Infringement>> {
        return this.store.pipe(
            select(infringementNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/infringement?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(Infringement, item));
                        }
                        return response;
                    }),
                    tap((infringementsPaginated) => {
                        this.store.dispatch(infringementNgrxHelper.loadPage({ items: infringementsPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(infringementNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/infringement/spreadsheet?${query}`, columns);
            }),
        );
    }
}
