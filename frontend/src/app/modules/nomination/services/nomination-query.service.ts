import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { nominationNgrxHelper, NominationState } from '@modules/nomination/ngrx/nomination.reducer';
import { plainToClass } from 'class-transformer';

import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class NominationQueryService extends ApiQueryService<Nomination> {
    constructor(http: HttpService, private store: Store<NominationState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Nomination>> {
        return this.http.getSecure(`query/nomination?${query}`).pipe(
            map((response: PaginationResponseInterface<any>) => {
                if (!isEmpty(response.data)) {
                    response.data = response.data.map((item) => plainToClass(Nomination, item));
                }
                return response;
            }),
            tap((nominationsPaginated) => {
                this.store.dispatch(nominationNgrxHelper.load({ items: nominationsPaginated.data }));
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.http.downloadFileWithBody(`query/nomination/spreadsheet?${query}`, columns);
    }
}
