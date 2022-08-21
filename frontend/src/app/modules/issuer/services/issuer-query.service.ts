import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class IssuerQueryService extends ApiQueryService<Issuer> {
    constructor(http: HttpService, private store: Store<IssuerState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Issuer>> {
        return this.store.pipe(
            select(issuerNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/issuer?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(Issuer, item));
                        }
                        return response;
                    }),
                    tap((issuerPaginated) => {
                        this.store.dispatch(issuerNgrxHelper.loadPage({ items: issuerPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(issuerNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/issuer/spreadsheet?${query}`, columns);
            }),
        );
    }
}
