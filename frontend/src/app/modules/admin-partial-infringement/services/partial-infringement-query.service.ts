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
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import {
    partialInfringementNgrxHelper,
    PartialInfringementState,
} from '@modules/admin-partial-infringement/ngrx/partial-infringement.reducer';

@Injectable({
    providedIn: 'root',
})
export class PartialInfringementQueryService extends ApiQueryService<PartialInfringement> {
    constructor(http: HttpService, private store: Store<PartialInfringementState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<PartialInfringement>> {
        return this.store.pipe(
            select(partialInfringementNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/partial-infringement?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(PartialInfringement, item));
                        }
                        return response;
                    }),
                    tap((partialInfringementPaginated) => {
                        this.store.dispatch(partialInfringementNgrxHelper.loadPage({ items: partialInfringementPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        // RPF-473
        return;
    }
}
