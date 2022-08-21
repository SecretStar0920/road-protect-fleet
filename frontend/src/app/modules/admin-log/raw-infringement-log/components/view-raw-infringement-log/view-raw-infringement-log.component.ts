import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    rawInfringementLogNgrxHelper,
    RawInfringementLogState,
} from '@modules/admin-log/raw-infringement-log/ngrx/raw-infringement-log.reducer';
import { RawInfringementLogService } from '@modules/admin-log/raw-infringement-log/services/raw-infringement-log.service';
import { RawInfringementLog, RawInfringementStatus } from '@modules/shared/models/entities/raw-infringement-log.model';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'rp-view-raw-infringement-log',
    templateUrl: './view-raw-infringement-log.component.html',
    styleUrls: ['./view-raw-infringement-log.component.less'],
})
export class ViewRawInfringementLogComponent implements OnInit, OnDestroy {
    @Input() rawInfringementLogId: number;
    rawInfringementLog: RawInfringementLog;

    private destroy$ = new Subject();

    constructor(
        private store: Store<RawInfringementLogState>,
        private logger: NGXLogger,
        private rawInfringementLogService: RawInfringementLogService,
    ) {}

    ngOnInit() {
        this.getRawInfringementLog();
    }

    getRawInfringementLog() {
        this.store
            .pipe(
                select(rawInfringementLogNgrxHelper.selectEntityById(this.rawInfringementLogId), takeUntil(this.destroy$)),
                tap((rawInfringementLog) => {
                    if (!rawInfringementLog) {
                        this.logger.debug('RawInfringementLog not found on store, querying for it');
                        this.rawInfringementLogService.getRawInfringementLog(this.rawInfringementLogId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.rawInfringementLog = result;
            });
    }

    isCompleted(status: RawInfringementStatus) {
        return status === RawInfringementStatus.Completed;
    }

    isFailed(status: RawInfringementStatus) {
        return status === RawInfringementStatus.Failed;
    }

    isPending(status: RawInfringementStatus) {
        return status === RawInfringementStatus.Pending;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
