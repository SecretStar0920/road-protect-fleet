import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportingService } from '@modules/admin-reporting/services/reporting.service';
import { MultiSeries } from '@swimlane/ngx-charts';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';
import { infringementsDueReportingData } from '@modules/admin-reporting/ngrx/reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import { colors } from '@modules/shared/constants/colors';
import { isNil } from 'lodash';
import i18next from 'i18next';

@Component({
    selector: 'rp-infringement-due-reporting',
    templateUrl: './infringement-due-reporting.component.html',
    styleUrls: ['./infringement-due-reporting.component.less'],
})
export class InfringementDueReportingComponent implements OnInit, OnDestroy {
    infringementCalendarData: MultiSeries = [];

    yAxisTicks: any[] =
        i18next.dir(i18next.language) === 'ltr'
            ? [
                  i18next.t('dates.monday'),
                  i18next.t('dates.tuesday'),
                  i18next.t('dates.wednesday'),
                  i18next.t('dates.thursday'),
                  i18next.t('dates.friday'),
                  i18next.t('dates.saturday'),
                  i18next.t('dates.sunday'),
              ]
            : [
                  i18next.t('dates.sunday'),
                  i18next.t('dates.monday'),
                  i18next.t('dates.tuesday'),
                  i18next.t('dates.wednesday'),
                  i18next.t('dates.thursday'),
                  i18next.t('dates.friday'),
                  i18next.t('dates.saturday'),
              ];

    $destroy = new Subject();

    untilDate: Date = moment().add(1, 'year').toDate();

    colors = { domain: colors.graphPrimary };

    constructor(private reportingService: ReportingService, private store: Store<ReportingState>) {}

    ngOnInit() {
        this.store.pipe(select(infringementsDueReportingData), takeUntil(this.$destroy)).subscribe((result) => {
            if (isNil(result)) {
                this.reportingService.getInfringementsDueReportingData(this.untilDate.toISOString());
            }
            this.infringementCalendarData = result || [];
        });
    }

    formatXAxis(val: string) {
        const thisSunday = moment(val).day(0);
        const nextSunday = moment(val).day(7);
        return thisSunday.month() !== nextSunday.month() ? moment(val).format('MMM YYYY') : '';
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }

    refresh() {
        this.reportingService.getInfringementsDueReportingData(moment(this.untilDate).toISOString());
    }

    calendarTooltipText(c): string {
        return `
              <span class="tooltip-label">${c.cell.extra.date}</span>
              <span class="tooltip-val">${c.cell.value}</span>
                `;
    }
}
