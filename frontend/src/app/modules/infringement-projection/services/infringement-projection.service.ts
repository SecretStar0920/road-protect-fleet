import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { Observable } from 'rxjs';
import {
    clearInfringementProjectionData,
    requestInfringementProjectionData,
} from '@modules/infringement-projection/ngrx/infringement-projection.actions';
import { isNil } from 'ng-zorro-antd/core/util';
import { SliderDateRangeDto } from '@modules/shared/components/general-year-range-slider-input/general-year-range-slider.component';

export enum InfringementPredictionEndpoints {
    Owner = 'owner',
    User = 'user',
    Hybrid = 'hybrid',
}

export class RawInfringementPredictionData {
    offenceYear: string;
    offenceMonth: string;
    infringementCount: number;
    vehicleCountTotal?: number;
    vehicleCount: number;
    value: number;
    noContractCount: number;
    predicted?: boolean = false;
    infringementCountPaid?: number;
    infringementCountDue?: number;
    infringementCountOutstanding?: number;
    infringementCountApproved?: number;
    infringementCountClosed?: number;
    valuePaid?: number;
    valueDue?: number;
    valueOutstanding?: number;
    valueApproved?: number;
    valueClosed?: number;
}
export enum RawInfringementPredictionWarnings {
    noContracts = 'No Vehicle Contracts',
    noPreviousData = 'No Previous Data',
    noData = 'No Data',
}

export class InfringementProjectionDataDto {
    data: RawInfringementPredictionData[];
    warning?: RawInfringementPredictionWarnings;
}

export class GetInfringementProjectionDto {
    dateRange: SliderDateRangeDto;
    endpoint: InfringementPredictionEndpoints;
}

@Injectable({
    providedIn: 'root',
})
export class InfringementProjectionService {
    constructor(private http: HttpService, private store: Store<GraphingState>) {}

    getInfringementProjectionData(dto: GetInfringementProjectionDto): Observable<InfringementProjectionDataDto> {
        return this.http.postSecure(`infringement-projection-table`, dto).pipe(
            map((response) => {
                return plainToClass(InfringementProjectionDataDto, response);
            }),
            tap((data: any) => {
                if (isNil(data?.data) || data?.data.length < 1) {
                    this.store.dispatch(clearInfringementProjectionData());
                } else {
                    this.store.dispatch(requestInfringementProjectionData({ data }));
                }
            }),
        );
    }
}
