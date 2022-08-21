import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { accountNgrxHelper, AccountState } from '@modules/account/ngrx/account.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class AccountQueryService extends ApiQueryService<Account> {
    constructor(http: HttpService, private store: Store<AccountState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Account>> {
        return this.http.getSecure(`query/account?${query}`).pipe(
            map((response: PaginationResponseInterface<any>) => {
                if (!isEmpty(response.data)) {
                    response.data = response.data.map((item) => plainToClass(Account, item));
                }
                return response;
            }),
            tap((accountsPaginated) => {
                this.store.dispatch(accountNgrxHelper.loadPage({ items: accountsPaginated.data }));
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.http.downloadFileWithBody(`query/account/spreadsheet?${query}`, columns);
    }
}
