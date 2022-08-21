import { Component, OnDestroy, OnInit } from '@angular/core';
import { SingleSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { colors } from '@modules/shared/constants/colors';
import { select, Store } from '@ngrx/store';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { vehicleCountData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-account-vehicle-counts',
    templateUrl: './account-vehicle-counts.component.html',
    styleUrls: ['./account-vehicle-counts.component.less'],
})
export class AccountVehicleCountsComponent implements OnInit, OnDestroy {
    vehicleCountData: SingleSeries = [];
    selectedData: any = {};

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };
    drawerVisible: boolean = false;

    constructor(private store: Store<AccountReportingState>) {}

    ngOnInit() {
        // select data
        this.store.pipe(select(vehicleCountData), takeUntil(this.$destroy)).subscribe((result) => {
            this.vehicleCountData = result;
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }

    onSelect(data: any) {
        this.drawerVisible = true;
        this.selectedData = data;
    }

    onCloseDrawer() {
        this.drawerVisible = false;
        this.selectedData = {};
    }
}
