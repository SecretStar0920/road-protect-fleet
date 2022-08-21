import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportingService } from '@modules/admin-reporting/services/reporting.service';
import { SingleSeries } from '@swimlane/ngx-charts';
import { select, Store } from '@ngrx/store';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';
import { summaryReportingData } from '@modules/admin-reporting/ngrx/reporting.selectors';
import { isNil } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { colors } from '@modules/shared/constants/colors';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';

@Component({
    selector: 'rp-summary-reporting',
    templateUrl: './summary-reporting.component.html',
    styleUrls: ['./summary-reporting.component.less'],
})
export class SummaryReportingComponent implements OnInit, OnDestroy {
    summaryData: SingleSeries = [];
    graphingNumberCards: GraphingTypes = GraphingTypes.NumberCards;

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };

    constructor(private reportingService: ReportingService, private store: Store<ReportingState>) {}

    ngOnInit() {
        this.store.pipe(select(summaryReportingData), takeUntil(this.$destroy)).subscribe((result) => {
            if (isNil(result)) {
                this.reportingService.getSummaryReportingData();
            }
            this.summaryData = result || [];
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }
}
