import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { jobLogNgrxHelper, JobLogState } from '@modules/admin-log/job-log/ngrx/job-log.reducer';
import { JobLogService } from '@modules/admin-log/job-log/services/job-log.service';
import { JobLog, JobStatus } from '@modules/shared/models/entities/job-log.model';
import { UserType } from '@modules/shared/models/entities/user.model';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'rp-view-job-log',
    templateUrl: './view-job-log.component.html',
    styleUrls: ['./view-job-log.component.less'],
})
export class ViewJobLogComponent implements OnInit, OnDestroy {
    @Input() jobLogUuid: string;
    jobLog: JobLog;

    private destroy$ = new Subject();

    userTypes = UserType;

    constructor(
        private store: Store<JobLogState>,
        private logger: NGXLogger,
        private jobLogService: JobLogService,
        private socket: Socket,
    ) {}

    ngOnInit() {
        this.getJobLog();
        this.listenForCurrentJobUpdates();
    }

    getJobLog() {
        this.store
            .pipe(
                select(jobLogNgrxHelper.selectEntityById(this.jobLogUuid), takeUntil(this.destroy$)),
                tap((jobLog) => {
                    if (!jobLog) {
                        this.logger.debug('IntegrationRequestLog not found on store, querying for it');
                        this.jobLogService.getJobLog(this.jobLogUuid).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.jobLog = result;
            });
    }

    isCompleted(status) {
        return status === JobStatus.Completed;
    }

    isFailed(status) {
        return status === JobStatus.Failed;
    }

    isQueued(status) {
        return status === JobStatus.Queued;
    }

    isProcessing(status) {
        return status === JobStatus.InProgress;
    }

    private listenForCurrentJobUpdates() {
        this.socket
            .fromEvent('job')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.store.dispatch(jobLogNgrxHelper.updateOne({ item: { id: result.uuid, changes: result } }));
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
