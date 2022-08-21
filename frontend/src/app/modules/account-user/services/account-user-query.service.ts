import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { accountUserNgrxHelper, AccountUserState } from '@modules/account-user/ngrx/account-user.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class AccountUserQueryService extends ApiQueryService<AccountUser> {
    constructor(http: HttpService, private store: Store<AccountUserState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<AccountUser>> {
        return this.store.pipe(
            select(accountUserNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/account-user?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(AccountUser, item));
                        }
                        return response;
                    }),
                    tap((accountUserPaginated) => {
                        this.store.dispatch(accountUserNgrxHelper.loadPage({ items: accountUserPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(accountUserNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/account-user/spreadsheet?${query}`, columns);
            }),
        );
    }
}
