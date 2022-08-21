import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { driverNgrxHelper, DriverState } from '@modules/admin-driver/ngrx/driver.reducer';

@Injectable({
    providedIn: 'root',
})
export class DriverQueryService extends ApiQueryService<Driver> {
    constructor(http: HttpService, private store: Store<DriverState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Driver>> {
        return this.store.pipe(
            select(driverNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/driver?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(Driver, item));
                        }
                        return response;
                    }),
                    tap((driverPaginated) => {
                        this.store.dispatch(driverNgrxHelper.loadPage({ items: driverPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return;
    }
}
