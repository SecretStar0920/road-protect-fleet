import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { graphingByStatus, graphingByStatusPreviousYear } from '@modules/graphing/ngrx/graphing.actions';
import { Observable } from 'rxjs';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GeneralRawGraphingByData } from '@modules/graphing/services/graphing-table.service';
import {
    GraphingDataDto,
    ReportingEndpoints,
} from '@modules/graphing/components/general-graphing-by-page/general-graphing-by-page.component';

@Injectable({
    providedIn: 'root',
})
export class GraphingByStatusPageService {
    constructor(private http: HttpService, private store: Store<GraphingState>) {}

    getGraphingByStatusData(dto: DateRangeDto, endpoint: ReportingEndpoints): Observable<GeneralRawGraphingByData[]> {
        const newDto: GraphingDataDto = { ...dto, endpoint };

        return this.http.postSecure(`graphing/by-status`, newDto).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneralRawGraphingByData, item));
                }
                return [];
            }),
            tap((data: any[]) => {
                this.store.dispatch(graphingByStatus({ data, dto }));
            }),
        );
    }

    getGraphingByStatusPreviousYearData(
        dto: DateRangeDto,
        numberOfYears: number,
        endpoint: ReportingEndpoints,
    ): Observable<GeneralRawGraphingByData[]> {
        const newDto: GraphingDataDto = { ...dto, endpoint };
        return this.http.postSecure(`graphing/by-status`, newDto).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneralRawGraphingByData, item));
                }
                return [];
            }),
            tap((data: any[]) => {
                this.store.dispatch(graphingByStatusPreviousYear({ data, numberOfYears }));
            }),
        );
    }
}
