import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { tap } from 'rxjs/operators';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';
import { Store } from '@ngrx/store';
import {
    loadInfringementsDueReportingAction,
    loadInfringementStatusReportingAction,
    loadIssuerInfringementsReportingAction,
    loadSummaryReportingAction,
    loadVehicleReportingAction,
} from '@modules/admin-reporting/ngrx/reporting.actions';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class ReportingService {
    constructor(private http: HttpService, private store: Store<ReportingState>) {}

    getSummaryReportingData(): void {
        this.http
            .postSecure('reporting/summary', {})
            .pipe(
                tap((result) => {
                    this.store.dispatch(loadSummaryReportingAction(result));
                }),
            )
            .subscribe();
    }

    getVehicleReportingData(): void {
        this.http
            .postSecure('reporting/vehicle', {})
            .pipe(
                tap((result) => {
                    this.store.dispatch(loadVehicleReportingAction(result));
                }),
            )
            .subscribe();
    }

    getInfringementStatusReportingData(data: { createdRange: Date[]; paymentRange: Date[] }): void {
        const body = { createdRange: [], paymentRange: [] };
        body.createdRange = data.createdRange.map((date) => date.toISOString());
        body.paymentRange = data.paymentRange.map((date) => date.toISOString());
        this.http
            .postSecure('reporting/infringement/status', body)
            .pipe(
                tap((result) => {
                    this.store.dispatch(loadInfringementStatusReportingAction(result));
                }),
            )
            .subscribe();
    }

    getInfringementsDueReportingData(untilDate: string = moment().add(1, 'year').toISOString()): void {
        this.http
            .postSecure('reporting/infringement/calendar', { date: untilDate })
            .pipe(
                tap((result) => {
                    this.store.dispatch(loadInfringementsDueReportingAction(result));
                }),
            )
            .subscribe();
    }

    getIssuerInfringementsReportingData(): void {
        this.http
            .postSecure('reporting/issuer/infringement', {})
            .pipe(
                tap((result) => {
                    this.store.dispatch(loadIssuerInfringementsReportingAction(result));
                }),
            )
            .subscribe();
    }
}
