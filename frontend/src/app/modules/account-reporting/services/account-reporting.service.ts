import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable } from 'rxjs';
import { MetabaseItemDetailsArray, ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { MultiSeries } from '@swimlane/ngx-charts';

@Injectable({
    providedIn: 'root',
})
export class AccountReportingService {
    constructor(private http: HttpService) {}

    getAccountSummaryData(accountId: number): Observable<ReportingDataDto> {
        return this.http.postSecure(`account/${accountId}/reporting/summary`, {});
    }

    getVehicleCountData(accountId: number): Observable<ReportingDataDto> {
        return this.http.postSecure(`account/${accountId}/reporting/vehicle`, {});
    }

    getLeadingVehiclesData(accountId: number): Observable<ReportingDataDto> {
        return this.http.postSecure(`account/${accountId}/reporting/vehicle/leading`, {});
    }

    getInfringementCountData(accountId: number): Observable<ReportingDataDto<MultiSeries>> {
        return this.http.postSecure(`account/${accountId}/reporting/infringement`, {});
    }

    getMetabaseReportingDetails(): Observable<ReportingDataDto<MetabaseItemDetailsArray>> {
        return this.http.getSecure('metabase-account-questions/details');
    }

    getMetabaseKpiReportingDetails(): Observable<ReportingDataDto<MetabaseItemDetailsArray>> {
        return this.http.getSecure(`metabase-account-questions/details/kpi`);
    }

    getInfringementAmountData(accountId: number): Observable<ReportingDataDto> {
        return this.http.postSecure(`account/${accountId}/reporting/infringement/amount`, {});
    }
}
