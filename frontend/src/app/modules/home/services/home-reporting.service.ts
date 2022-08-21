import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable, of } from 'rxjs';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { NgxDataPoint } from '@modules/shared/models/ngx-series-data.model';
import { IsDefined } from 'class-validator';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { ContractStatus } from '@modules/shared/models/entities/contract.model';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { HomeReportingState } from '@modules/home/ngrx/home-reporting.reducer';
import { homeReportingDates } from '@modules/home/ngrx/home-reporting.selectors';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import i18next from 'i18next';

export class HomeReportingDataDto {
    @IsDefined()
    totals: NgxDataPoint[];
    @IsDefined()
    leadingIssuer: {
        count: string;
        name: string;
    };
    @IsDefined()
    leadingVehicle: {
        count: string;
        registration: string;
    };
    @IsDefined()
    costs: NgxDataPoint[];
    @IsDefined()
    nominationStatus: NgxDataPoint[];
    @IsDefined()
    infringementStatus: NgxDataPoint[];
    @IsDefined()
    infringementOutstandingSoon: NgxDataPoint[];
    @IsDefined()
    contractStatus: NgxDataPoint[];
    @IsDefined()
    vehicles: NgxDataPoint[];
    @IsDefined()
    issuers: NgxDataPoint[];
    @IsDefined()
    issuerTotal: NgxDataPoint[];
}

@Injectable({
    providedIn: 'root',
})
export class HomeReportingService {
    constructor(private http: HttpService, private store: Store<HomeReportingState>) {}
    private reportingPrimaryColours = { green: '#037f51', orange: '#fa8c16', red: '#da0a15' };
    private _defaultPaymentDays: number = 60;

    getHomeReportingData(dates: DateRangeDto): Observable<HomeReportingDataDto> {
        return this.http.postSecure(`home-reporting`, dates);
    }

    manipulateHomeReportingData(data: HomeReportingDataDto): Observable<HomeReportingDataDto> {
        let tempData = cloneDeep(data);
        tempData = this.addColourAndRoutingToData(tempData);
        return this.addTranslationsToData(tempData);
    }

    addTranslationsToData(data: HomeReportingDataDto): Observable<HomeReportingDataDto> {
        data.infringementStatus?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.infringement-status.' + dataPoint.name);
        });
        data.issuerTotal?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.issuers.' + dataPoint.name);
        });
        data.vehicles?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.vehicles.' + dataPoint.name);
        });
        data.nominationStatus?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.nomination-status.' + dataPoint.name);
        });
        data.contractStatus?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.contract-status.' + dataPoint.name);
        });
        data.infringementOutstandingSoon?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.infringement-status.' + dataPoint.name);
        });
        data.costs?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.costs.' + dataPoint.name);
        });
        data.totals?.map((dataPoint) => {
            dataPoint.name = i18next.t('home.totals.' + dataPoint.name);
        });
        return of(data);
    }

    addColourAndRoutingToData(data: HomeReportingDataDto): HomeReportingDataDto {
        // Set up variables for readability
        let infringementBaseParams: { [key: string]: any } = {
            useDefaultPreset: false,
        };
        let dates: DateRangeDto;
        this.store.pipe(select(homeReportingDates), take(1)).subscribe((result) => {
            if (!!result) {
                dates = result;
                infringementBaseParams = {
                    useDefaultPreset: false,
                    'offenceDate.min': result?.startDate,
                    'offenceDate.max': result?.endDate,
                };
            }
        });
        const infringementRoute = ['/home', 'account', 'infringements'];
        const contractRoute = ['/home', 'account', 'contracts'];

        // Colours for costs
        data.costs?.map((dataPoint) => {
            if (dataPoint.name === 'amountDue') {
                dataPoint.extra = { colour: this.reportingPrimaryColours.orange };
            } else if (dataPoint.name === 'penaltyAmount') {
                dataPoint.extra = { colour: this.reportingPrimaryColours.red };
            } else if (dataPoint.name === 'totalPayments') {
                dataPoint.extra = { colour: this.reportingPrimaryColours.green };
            }
        });
        // Colours for infringements
        data.infringementStatus?.map((dataPoint) => {
            if (dataPoint.name === InfringementStatus.Outstanding) {
                dataPoint.extra = {
                    router: infringementRoute,
                    params: { ...infringementBaseParams, status: InfringementStatus.Outstanding },
                    colour: this.reportingPrimaryColours.red,
                };
            } else if (dataPoint.name === InfringementStatus.ApprovedForPayment) {
                dataPoint.extra = {
                    router: infringementRoute,
                    params: { ...infringementBaseParams, status: InfringementStatus.ApprovedForPayment },
                    colour: this.reportingPrimaryColours.green,
                };
            }
        });
        data.infringementOutstandingSoon?.map((dataPoint) => {
            dataPoint.extra = {
                router: infringementRoute,
                params: {
                    useDefaultPreset: false,
                    status: [InfringementStatus.Due, InfringementStatus.ApprovedForPayment],
                    'latestPaymentDate.min': dates?.endDate,
                    'latestPaymentDate.max': moment(dates?.endDate).add(this._defaultPaymentDays, 'days').toISOString(),
                },
                colour: this.reportingPrimaryColours.orange,
            };
        });
        // Colors for contract statuses
        data.contractStatus?.map((dataPoint) => {
            if (dataPoint.name === ContractStatus.Expired) {
                dataPoint.extra = {
                    colour: this.reportingPrimaryColours.red,
                    router: contractRoute,
                    params: { status: ContractStatus.Expired },
                };
            } else if (dataPoint.name === ContractStatus.Valid) {
                dataPoint.extra = {
                    colour: this.reportingPrimaryColours.green,
                    router: contractRoute,
                    params: { status: ContractStatus.Valid },
                };
            } else if (dataPoint.name === ContractStatus.ExpiringSoon) {
                dataPoint.extra = {
                    colour: this.reportingPrimaryColours.orange,
                    router: contractRoute,
                    params: { status: ContractStatus.ExpiringSoon },
                };
            } else if (dataPoint.name === ContractStatus.Missing) {
                dataPoint.extra = {
                    colour: this.reportingPrimaryColours.red,
                    router: contractRoute,
                    params: { status: ContractStatus.Missing },
                };
            } else if (dataPoint.name === ContractStatus.Upcoming) {
                dataPoint.extra = {
                    colour: this.reportingPrimaryColours.green,
                    router: contractRoute,
                    params: { status: ContractStatus.Upcoming },
                };
            }
        });
        return data;
    }
}
