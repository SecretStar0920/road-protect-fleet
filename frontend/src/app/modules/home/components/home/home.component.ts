import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { of, Subject } from 'rxjs';
import { AuthService } from '@modules/auth/services/auth.service';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccount, currentRole, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { AccountService } from '@modules/account/services/account.service';
import { cloneDeep, isEmpty } from 'lodash';
import { Role } from '@modules/shared/models/entities/role.model';
import { SocketManagementService } from '@modules/shared/modules/realtime/services/socket-management.service';
import { AccountUserService } from '@modules/account-user/services/account-user.service';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';
import { Router } from '@angular/router';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { HomeReportingDataDto } from '@modules/home/services/home-reporting.service';
import { getHomeReportingData, setHomeReportingDates } from '@modules/home/ngrx/home-reporting.actions';
import { homeReportingData } from '@modules/home/ngrx/home-reporting.selectors';
import { CardFormat } from '@modules/home/components/home/home-number-card/home-number-card.component';
import { NgxDataPoint } from '@modules/shared/models/ngx-series-data.model';
import i18next from 'i18next';
import { setGraphingByDate } from '@modules/graphing/ngrx/graphing.actions';

@Component({
    selector: 'rp-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, OnDestroy {
    permissions = PERMISSIONS;
    dateRangeForm: FormGroup;
    selectedDates: DateRangeDto;
    cardFormat = CardFormat;

    userTypes = UserType;
    private destroy$ = new Subject();

    user: User;
    currentAccount: Account;
    role: Role;
    homeReportingData: HomeReportingDataDto;
    graphingTypes = GraphingTypes;

    sendingReport = false

    constructor(
        private authService: AuthService,
        private store: Store<AuthState>,
        private accountService: AccountService,
        private socketManagementService: SocketManagementService,
        private accountUserService: AccountUserService,
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.dateRangeForm = this.fb.group({
            dateRange: new FormControl(null, Validators.required),
        });
    }

    ngOnInit() {
        this.getCurrentAccountUser();
        this.getCurrentRole();
        this.getCurrentAccount();

        // Set default dates
        const defaultDates = {
            startDate: moment().subtract(12, 'months').toISOString(),
            endDate: moment().toISOString(),
        };
        this.dateRangeForm.controls.dateRange.setValue({ min: defaultDates.startDate, max: defaultDates.endDate });

        this.getAccountReportingData();
    }

    getCurrentAccountUser() {
        this.store.pipe(select(currentUser), takeUntil(this.destroy$)).subscribe((user) => {
            this.user = user;
        });
    }

    getCurrentRole() {
        this.store.pipe(select(currentRole), takeUntil(this.destroy$)).subscribe((role) => {
            this.role = role;
        });
    }

    calculateTotal(data: NgxDataPoint[]): NgxDataPoint[] {
        if (data.length < 1) {
            return [{ name: i18next.t('home.total_value'), value: 0 }];
        }
        const reducedData = data.reduce((total, current) => {
            return { name: i18next.t('home.total_value'), value: Number(total.value) + Number(current.value) };
        });
        const totalValue = cloneDeep(reducedData);
        totalValue.name = i18next.t('home.total_value');
        totalValue.extra = null;
        return [totalValue];
    }

    getCurrentAccount() {
        this.store
            .pipe(
                select(currentAccount),
                mergeMap((account) => {
                    if (isEmpty(account)) {
                        return this.accountService.getCurrentAccount();
                    } else {
                        return of(account);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((result) => {
                this.currentAccount = result;
            });
    }

    getSummaryStatusData(): NgxDataPoint[] {
        const summaryStatusData = cloneDeep(this.homeReportingData.infringementStatus);
        const summaryOutstandingData: NgxDataPoint = cloneDeep(this.homeReportingData.infringementOutstandingSoon[0]);
        const filteredData: NgxDataPoint[] = summaryStatusData.filter(
            (status) =>
                status.name === i18next.t('home.infringement-status.Outstanding') ||
                status.name === i18next.t('home.infringement-status.Approved for Payment'),
        );
        filteredData.splice(1, 0, summaryOutstandingData);
        return filteredData;
    }

    getAccountReportingData() {
        const dates = {
            startDate: moment(this.dateRangeForm.value.dateRange.min).toISOString(),
            endDate: moment(this.dateRangeForm.value.dateRange.max).toISOString(),
        };
        this.store.dispatch(getHomeReportingData.request({ request: dates }));
        this.store.dispatch(setHomeReportingDates({ dates }));
        this.store.pipe(select(homeReportingData), takeUntil(this.destroy$)).subscribe((data: HomeReportingDataDto) => {
            this.homeReportingData = data;
        });
    }

    onChangeDate() {
        const dates = {
            startDate: moment(this.dateRangeForm.value.dateRange.min).toISOString(),
            endDate: moment(this.dateRangeForm.value.dateRange.max).toISOString(),
        };
        this.store.dispatch(getHomeReportingData.request({ request: dates }));
    }

    getOutstandingSoonDate() {
        return moment().startOf('day').add(60, 'days').toISOString();
    }

    onSelect($event) {
        const dates = {
            min: moment(this.dateRangeForm.value.dateRange.min).toISOString(),
            max: moment(this.dateRangeForm.value.dateRange.max).toISOString(),
        };
        if ($event.name === i18next.t('home.totals.infringementCount') || $event.name === i18next.t('home.totals.infringementAvgCost')) {
            this.router.navigate(['/home', 'account', 'infringements'], {
                queryParams: { useDefaultPreset: false, 'offenceDate.min': dates.min, 'offenceDate.max': dates.max },
            });
        } else if (
            $event.name === i18next.t('home.totals.vehicleCount') ||
            $event.name === i18next.t('home.totals.vehicleAvgInfringement')
        ) {
            this.router.navigate(['/home', 'account', 'vehicles'], { queryParams: { useDefaultPreset: false, tab: 'all' } });
        } else if ($event.name === i18next.t('home.totals.contractCount')) {
            this.router.navigate(['/home', 'account', 'contracts']);
        } else if ($event.name === i18next.t('home.totals.userCount')) {
            this.router.navigate(['/home', 'account', 'users']);
        } else if ($event.name === i18next.t('home.vehicles.ownedVehicles')) {
            this.router.navigate(['/home', 'account', 'vehicles'], { queryParams: { useDefaultPreset: false, tab: 'owned' } });
        } else if ($event.name === i18next.t('home.vehicles.leasedVehicles')) {
            this.router.navigate(['/home', 'account', 'vehicles'], { queryParams: { useDefaultPreset: false, tab: 'fleet' } });
        } else if ($event.name === i18next.t('home.vehicles.allVehicles')) {
            this.router.navigate(['/home', 'account', 'vehicles'], { queryParams: { useDefaultPreset: false, tab: 'all' } });
        } else if ($event.name === i18next.t('home.issuers.issuerTotal')) {
            this.store.dispatch(setGraphingByDate({ dates: { startDate: dates.min, endDate: dates.max } }));
            this.router.navigate(['/home', 'account', 'reporting'], {
                queryParams: { tab: 'issuer' },
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
