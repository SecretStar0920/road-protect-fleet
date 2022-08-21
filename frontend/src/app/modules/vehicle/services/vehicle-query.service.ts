import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { vehicleNgrxHelper, VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { HttpParams } from '@angular/common/http';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { AdvancedTableColumn } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Injectable({
    providedIn: 'root',
})
export class VehicleQueryService extends ApiQueryService<Vehicle> {
    constructor(http: HttpService, private store: Store<VehicleState>) {
        super(http);
    }

    query(query: string) {
        return this.store.pipe(
            select(vehicleNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.getSecure(`query/vehicle?${query}`).pipe(
                    map((response: PaginationResponseInterface<any>) => {
                        if (!isEmpty(response.data)) {
                            response.data = response.data.map((item) => plainToClass(Vehicle, item));
                        }
                        return response;
                    }),
                    tap((vehiclePaginated) => {
                        this.store.dispatch(vehicleNgrxHelper.loadPage({ items: vehiclePaginated.data }));
                    }),
                );
            }),
        );
    }

    queryAsSpreadsheet(query: string, columns: AdvancedTableColumn[]): Observable<{ file: Blob; filename: string }> {
        return this.store.pipe(
            select(vehicleNgrxHelper.selectQueryParams()),
            take(1),
            switchMap((params) => {
                const httpParams = new HttpParams({
                    fromObject: params,
                });
                query += `&${httpParams.toString()}`;
                return this.http.downloadFileWithBody(`query/vehicle/spreadsheet?${query}`, columns);
            }),
        );
    }
}
