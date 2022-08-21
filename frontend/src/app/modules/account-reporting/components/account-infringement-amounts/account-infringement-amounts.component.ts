import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataItem, SingleSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { colors } from '@modules/shared/constants/colors';
import { select, Store } from '@ngrx/store';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { infringementAmountData } from '@modules/account-reporting/ngrx/account-reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import { environment } from '@environment/environment';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'rp-account-infringement-amounts',
    templateUrl: './account-infringement-amounts.component.html',
    styleUrls: ['./account-infringement-amounts.component.less'],
})
export class AccountInfringementAmountsComponent implements OnInit, OnDestroy {
    infringementAmountData: SingleSeries = [];
    infringementTotalData: DataItem;
    selectedData: any = {};

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };
    drawerVisible: boolean = false;

    currency = environment.currency;

    constructor(private store: Store<AccountReportingState>) {}

    ngOnInit() {
        // select data
        this.store.pipe(select(infringementAmountData), takeUntil(this.$destroy)).subscribe((result: SingleSeries) => {
            const copy = result.slice();
            this.infringementTotalData = copy.pop();
            this.infringementAmountData = copy;
        });
    }

    formatValue = (number: number) => {
        return `${this.currency.symbol} ${new BigNumber(number).toFixed(2)}`;
    };

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
