import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportingService } from '@modules/admin-reporting/services/reporting.service';
import { SingleSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';
import { infringementStatusReportingData } from '@modules/admin-reporting/ngrx/reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { colors } from '@modules/shared/constants/colors';
import * as moment from 'moment';

class DateRangeDto {
    startDate?: Date;
    endDate?: Date;
}
@Component({
    selector: 'rp-infringement-status-reporting',
    templateUrl: './infringement-status-reporting.component.html',
    styleUrls: ['./infringement-status-reporting.component.less'],
})
export class InfringementStatusReportingComponent implements OnInit, OnDestroy {
    infringementStatusData: SingleSeries = [];

    $destroy = new Subject();
    colors = { domain: colors.graphPrimary };

    createdDates: DateRangeDto = { startDate: moment().add(-1, 'year').toDate(), endDate: moment().add(1, 'year').toDate() };
    paymentDates: DateRangeDto = { startDate: moment().add(-1, 'year').toDate(), endDate: moment().add(1, 'year').toDate() };

    constructor(private reportingService: ReportingService, private store: Store<ReportingState>) {}

    ngOnInit() {
        this.store.pipe(select(infringementStatusReportingData), takeUntil(this.$destroy)).subscribe((result) => {
            if (isNil(result)) {
                this.reportingService.getInfringementStatusReportingData({
                    createdRange: [this.createdDates.startDate, this.createdDates.endDate],
                    paymentRange: [this.paymentDates.startDate, this.paymentDates.endDate],
                });
            }
            this.infringementStatusData = result || [];
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }

    refresh() {
        this.reportingService.getInfringementStatusReportingData({
            createdRange: [this.createdDates.startDate, this.createdDates.endDate],
            paymentRange: [this.paymentDates.startDate, this.paymentDates.endDate],
        });
    }
}
