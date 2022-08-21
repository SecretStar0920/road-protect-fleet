import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from '@modules/shared/models/entities/user.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { userNgrxHelper, UserState } from '@modules/user/ngrx/user.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class UserQueryService extends ApiQueryService<User> {
    constructor(http: HttpService, private store: Store<UserState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<User>> {
        return this.store.pipe(
            select(userNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/user?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(User, item));
                        }
                        return response;
                    }),
                    tap((userPaginated) => {
                        this.store.dispatch(userNgrxHelper.loadPage({ items: userPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(userNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/user/spreadsheet?${query}`, columns);
            }),
        );
    }
}
