import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { accountRelationNgrxHelper, AccountRelationState } from '@modules/account-relation/ngrx/account-relation.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class AccountRelationQueryService extends ApiQueryService<AccountRelation> {
    constructor(http: HttpService, private store: Store<AccountRelationState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<AccountRelation>> {
        return this.store.pipe(
            select(accountRelationNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/account-relation?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(AccountRelation, item));
                        }
                        return response;
                    }),
                    tap((accountRelationPaginated) => {
                        this.store.dispatch(accountRelationNgrxHelper.loadPage({ items: accountRelationPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(accountRelationNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/account-relation/spreadsheet?${query}`, columns);
            }),
        );
    }
}
