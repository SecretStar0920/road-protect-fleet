import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { ReportingService } from '@modules/admin-reporting/services/reporting.service';
import { select, Store } from '@ngrx/store';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';
import { issuerInfringementsReportingData } from '@modules/admin-reporting/ngrx/reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { colors } from '@modules/shared/constants/colors';
import { GraphingTypes } from '@modules/shared/components/general-graphing/general-graphing.component';

@Component({
    selector: 'rp-issuer-infringement-reporting',
    templateUrl: './issuer-infringement-reporting.component.html',
    styleUrls: ['./issuer-infringement-reporting.component.less'],
})
export class IssuerInfringementReportingComponent implements OnInit, OnDestroy {
    issuerInfringements: MultiSeries = [];
    comparisonGraphing: GraphingTypes = GraphingTypes.GroupedVerticalBarGraph;
    view: [number, number];
    barPadding = 3;
    groupPadding = 1;

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };

    constructor(private reportingService: ReportingService, private store: Store<ReportingState>) {}

    ngOnInit() {
        this.store.pipe(select(issuerInfringementsReportingData), takeUntil(this.$destroy)).subscribe((result) => {
            if (isNil(result)) {
                this.reportingService.getIssuerInfringementsReportingData();
            }
            this.issuerInfringements = result || [];
            this.view =
                this.issuerInfringements.length > 15 ? [Math.max(Math.floor(this.issuerInfringements.length / 5) * 1000), 400] : null;
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }
}
