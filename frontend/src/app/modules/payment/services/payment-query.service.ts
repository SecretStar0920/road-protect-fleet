import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { paymentNgrxHelper, PaymentState } from '@modules/payment/ngrx/payment.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class PaymentQueryService extends ApiQueryService<Payment> {
    constructor(http: HttpService, private store: Store<PaymentState>) {
        super(http);
    }

    query(query: string): Observable<PaginationResponseInterface<Payment>> {
        return this.http.getSecure(`query/payment?${query}`).pipe(
            map((response: PaginationResponseInterface<any>) => {
                if (!isEmpty(response.data)) {
                    response.data = response.data.map((item) => plainToClass(Payment, item));
                }
                return response;
            }),
            tap((paymentsPaginated) => {
                this.store.dispatch(paymentNgrxHelper.loadPage({ items: paymentsPaginated.data }));
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.http.downloadFileWithBody(`query/payment/spreadsheet?${query}`, columns);
    }
}
