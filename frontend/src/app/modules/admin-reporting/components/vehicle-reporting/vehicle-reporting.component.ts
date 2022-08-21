import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportingService } from '@modules/admin-reporting/services/reporting.service';
import { SingleSeries } from '@swimlane/ngx-charts';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ReportingState } from '@modules/admin-reporting/ngrx/reporting.reducer';
import { vehicleReportingData } from '@modules/admin-reporting/ngrx/reporting.selectors';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { colors } from '@modules/shared/constants/colors';
import i18next from 'i18next';

@Component({
    selector: 'rp-vehicle-reporting',
    templateUrl: './vehicle-reporting.component.html',
    styleUrls: ['./vehicle-reporting.component.less'],
})
export class VehicleReportingComponent implements OnInit, OnDestroy {
    vehicleData: SingleSeries = [];

    $destroy = new Subject();

    colors = { domain: colors.graphPrimary };

    boundFormatDataLabel: any;

    constructor(private reportingService: ReportingService, private store: Store<ReportingState>) {
        this.boundFormatDataLabel = this.formatDataLabel.bind(this);
    }

    ngOnInit() {
        this.store.pipe(select(vehicleReportingData), takeUntil(this.$destroy)).subscribe((result) => {
            if (isNil(result)) {
                this.reportingService.getVehicleReportingData();
            }
            this.vehicleData = result || [];
        });
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }

    public formatDataLabel(value) {
        return i18next.t('reporting.' + value.label);
    }
}
