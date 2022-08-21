import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class ContractQueryService extends ApiQueryService<Contract> {
    constructor(http: HttpService, private store: Store<ContractState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Contract>> {
        return this.store.pipe(
            select(contractNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/contract?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(Contract, item));
                        }
                        return response;
                    }),
                    tap((contractsPaginated) => {
                        this.store.dispatch(contractNgrxHelper.loadPage({ items: contractsPaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(contractNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/contract/spreadsheet?${query}`, columns);
            }),
        );
    }
}
