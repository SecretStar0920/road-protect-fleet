import { Component, OnDestroy, OnInit } from '@angular/core';
import { SingleSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { colors } from '@modules/shared/constants/colors';
import { select, Store } from '@ngrx/store';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { leadingVehiclesData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import { environment } from '@environment/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-account-leading-vehicles',
    templateUrl: './account-leading-vehicles.component.html',
    styleUrls: ['./account-leading-vehicles.component.less'],
})
export class AccountLeadingVehiclesComponent implements OnInit, OnDestroy {
    leadingVehicleData: SingleSeries = [];
    selectedData: any = {};

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };
    drawerVisible: boolean = false;

    currency = environment.currency.symbol;

    constructor(private store: Store<AccountReportingState>, private router: Router) {}

    ngOnInit() {
        // select data
        this.store.pipe(select(leadingVehiclesData), takeUntil(this.$destroy)).subscribe((result) => {
            this.leadingVehicleData = result;
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }

    onSelect(data: any) {
        this.router.navigate(['/home', 'vehicles', 'view', data.extra.vehicle.vehicleId]);
    }

    onCloseDrawer() {
        this.drawerVisible = false;
        this.selectedData = {};
    }

    formatDataLabel = (data) => {
        const value = new BigNumber(data).toFixed(2);
        return `${this.currency} ${value}`;
    };

    formatXAxis = (data) => {
        const value = new BigNumber(data).toFixed(2);
        return `${this.currency} ${value}`;
    };
}
