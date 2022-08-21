import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { jobLogNgrxHelper, JobLogState } from '@modules/admin-log/job-log/ngrx/job-log.reducer';
import { JobLogQueryService } from '@modules/admin-log/job-log/services/job-log-query.service';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { JobStatus } from '@modules/shared/models/entities/job-log.model';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { Store } from '@ngrx/store';
import i18next from 'i18next';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-job-logs-advanced',
    templateUrl: './view-job-logs-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: JobLogQueryService }],
    styleUrls: ['./view-job-logs-advanced.component.less'],
})
export class ViewJobLogsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) action: TemplateRef<any>;

    @ViewChild('queuedTime', { static: true }) queuedTimeTemplate: TemplateRef<any>;
    @ViewChild('endTime', { static: true }) endTimeTemplate: TemplateRef<any>;
    @ViewChild('jobType', { static: true }) jobTypeTemplate: TemplateRef<any>;
    @ViewChild('status', { static: true }) statusTemplate: TemplateRef<any>;
    @ViewChild('noticeNumber', { static: true }) noticeNumberTemplate: TemplateRef<any>;

    private destroy$ = new Subject();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<JobLogState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
        private socket: Socket,
    ) {
        this.configureTable();
        this.listenForCurrentJobPageUpdates();
    }

    private configureTable() {
        // this.table.pageDataSelector = jobLogSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.jobLogsTable }));
        this.table.ngrxHelper = jobLogNgrxHelper;
        this.table.options.primaryColumnKey = 'uuid';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'uuid',
                title: i18next.t('job-log.uuid'),
            },
            {
                key: 'queuedTime',
                title: i18next.t('job-log.queued_time'),
            },
            {
                key: 'processingEndTime',
                title: i18next.t('job-log.end_time'),
            },
            {
                key: 'status',
                title: i18next.t('job-log.status'),
            },
            {
                key: 'jobType',
                title: i18next.t('job-log.job_type'),
            },
            {
                key: 'noticeNumber',
                title: i18next.t('job-log.notice_number'),
            },
            // INSERT COLUMNS
        ];

        this.query.filterKeys = [
            {
                key: 'uuid',
                display: i18next.t('job-log.uuid'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'job',
                searchField: 'uuid',
            },
            {
                key: 'status',
                display: i18next.t('job-log.status'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: [JobStatus.Failed, JobStatus.Cancelled, JobStatus.Completed, JobStatus.Queued, JobStatus.InProgress],
            },
            {
                key: 'createdAt',
                display: i18next.t('job-log.timestamp'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'type',
                display: i18next.t('job-log.job_type'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: [
                    'AtgSyncSingleInfringementJob',
                    'JerusalemSyncMultipleInfringementsJob',
                    'JerusalemSyncSingleInfringementJob',
                    'MetroparkSyncSingleInfringementJob',
                    'KfarSabaSyncSingleInfringementJob',
                    'MileonSyncMultipleInfringementsJob',
                    'MileonSyncSingleInfringementJob',
                    'PoliceSyncMultipleInfringementsJob',
                    'PoliceSyncSingleInfringementJob',
                    'TelavivSyncMultipleInfringementsJob',
                    'TelavivSyncSingleInfringementJob',
                ],
            },
            {
                key: `details->'data'->>'noticeNumber'`,
                display: i18next.t('job-log.notice_number'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
            },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            queuedTime: this.queuedTimeTemplate,
            processingEndTime: this.endTimeTemplate,
            jobType: this.jobTypeTemplate,
            status: this.statusTemplate,
            noticeNumber: this.noticeNumberTemplate,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewJobLog(uuid: string) {
        if (!uuid) {
            this.logger.warn('Tried to view an JobLog without a uuid');
            return;
        }
        // this.router.navigate(['/home', 'logs', 'job', uuid]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'logs', 'job', uuid]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    isCompleted(status) {
        return status === JobStatus.Completed;
    }

    isFailed(status) {
        return status === JobStatus.Failed;
    }

    isCancelled(status) {
        return status === JobStatus.Cancelled;
    }

    isQueued(status) {
        return status === JobStatus.Queued;
    }

    isProcessing(status) {
        return status === JobStatus.InProgress;
    }

    private listenForCurrentJobPageUpdates() {
        this.socket
            .fromEvent('job')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.store.dispatch(jobLogNgrxHelper.updateOne({ item: { id: result.uuid, changes: result } }));
            });
    }
}
