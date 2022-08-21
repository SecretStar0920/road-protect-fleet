import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { colors } from '@modules/shared/constants/colors';
import { select, Store } from '@ngrx/store';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { infringementCountData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-account-infringement-counts',
    templateUrl: './account-infringement-counts.component.html',
    styleUrls: ['./account-infringement-counts.component.less'],
})
export class AccountInfringementCountsComponent implements OnInit, OnDestroy {
    infringementCountData: MultiSeries = [];
    selectedData: any = {};

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };
    drawerVisible: boolean = false;

    constructor(private store: Store<AccountReportingState>) {}

    ngOnInit() {
        // select data
        this.store.pipe(select(infringementCountData), takeUntil(this.$destroy)).subscribe((result) => {
            this.infringementCountData = result;
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
