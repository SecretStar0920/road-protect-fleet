import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { resetGraphingByDate, setGraphingByDate, setReportingEndpoint } from '@modules/graphing/ngrx/graphing.actions';
import { Subject } from 'rxjs';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { dateRange } from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';

export class GraphingDataDto {
    startDate?: string;
    endDate?: string;
    endpoint?: ReportingEndpoints;
}

export enum ReportingEndpoints {
    Owner = 'owner',
    User = 'user',
    All = 'all',
}

@Component({
    selector: 'rp-general-graphing-by-page',
    templateUrl: './general-graphing-by-page.component.html',
    styleUrls: ['./general-graphing-by-page.component.less'],
})
export class GeneralGraphingByPageComponent implements OnInit, OnDestroy {
    @Output() viewGraph: EventEmitter<boolean> = new EventEmitter();
    @Output() showComparison: EventEmitter<number> = new EventEmitter();
    dateRangeForm: FormGroup;
    private destroy$ = new Subject();
    numberOfYears: number = 0;
    yearsComparisonSliderRange: { min: number; max: number };
    dateRange: DateRangeDto;
    selectedEndpoint: ReportingEndpoints;
    reportingEndpoints = ReportingEndpoints;

    constructor(private fb: FormBuilder, private store: Store<GraphingState>) {
        this.dateRangeForm = this.fb.group({
            dateRange: new FormControl(null, Validators.required),
        });
        // Setup slider ranges
        this.yearsComparisonSliderRange = { min: 0, max: 5 };
    }
    ngOnInit() {
        this.store
            .select(dateRange)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.dateRange = result;
            });
        this.dateRangeForm.controls.dateRange.setValue({ min: this.dateRange.startDate, max: this.dateRange.endDate });
        this.updateDates();
        this.selectedEndpoint = ReportingEndpoints.All;
        this.store.dispatch(setReportingEndpoint({ endpoint: this.selectedEndpoint }));
    }

    updateDates(dates?: DateRangeDto) {
        if (!dates) {
            dates = {
                startDate: moment(this.dateRangeForm.value.dateRange.min).toISOString(),
                endDate: moment(this.dateRangeForm.value.dateRange.max).toISOString(),
            };
        }
        this.store.dispatch(setGraphingByDate({ dates }));
    }

    onChangeEndpoint() {
        this.store.dispatch(setReportingEndpoint({ endpoint: this.selectedEndpoint }));
    }

    onChangeDate() {
        this.numberOfYears = 0;
        this.updateDates();
        this.viewGraph.emit(true);
    }

    onShowComparison() {
        this.updateDates();
        this.showComparison.emit(this.numberOfYears);
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetGraphingByDate());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
