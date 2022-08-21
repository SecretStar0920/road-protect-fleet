import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    rawInfringementLogNgrxHelper,
    RawInfringementLogState,
} from '@modules/admin-log/raw-infringement-log/ngrx/raw-infringement-log.reducer';
import { RawInfringementLogQueryService } from '@modules/admin-log/raw-infringement-log/services/raw-infringement-log-query.service';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { RawInfringementStatus } from '@modules/shared/models/entities/raw-infringement-log.model';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { Store } from '@ngrx/store';
import i18next from 'i18next';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-raw-infringement-logs-advanced',
    templateUrl: './view-raw-infringement-logs-advanced.component.html',
    providers: [
        AdvancedFilterTableService,
        AdvancedQueryFilterService,
        { provide: ApiQueryService, useClass: RawInfringementLogQueryService },
    ],
    styleUrls: ['./view-raw-infringement-logs-advanced.component.less'],
})
export class ViewRawInfringementLogsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) action: TemplateRef<any>;

    @ViewChild('timestamp', { static: true }) timestampTemplate: TemplateRef<any>;
    @ViewChild('source', { static: true }) sourceTemplate: TemplateRef<any>;
    @ViewChild('isSuccessful', { static: true }) isSuccessfulTemplate: TemplateRef<any>;
    @ViewChild('formattedRawInfringement', { static: true }) formattedRawInfringementTemplate: TemplateRef<any>;
    @ViewChild('formattedResult', { static: true }) formattedResultTemplate: TemplateRef<any>;

    private destroy$ = new Subject();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<RawInfringementLogState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        // this.table.pageDataSelector = rawInfringementLogSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.rawInfringementLogsTable }));
        this.table.ngrxHelper = rawInfringementLogNgrxHelper;
        this.table.options.primaryColumnKey = 'rawInfringementId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'rawInfringementId',
                title: i18next.t('raw-infringement-log.raw_infringement_id'),
            },
            {
                key: 'timestamp',
                title: i18next.t('raw-infringement-log.timestamp'),
            },
            {
                key: 'noticeNumber',
                title: i18next.t('raw-infringement-log.notice_number'),
            },
            {
                key: 'issuer',
                title: i18next.t('raw-infringement-log.issuer'),
            },
            {
                key: 'isSuccessful',
                title: i18next.t('raw-infringement-log.success'),
            },
            {
                key: 'source',
                title: i18next.t('raw-infringement-log.source'),
            },
            {
                key: 'formattedRawInfringement',
                title: i18next.t('raw-infringement-log.data'),
            },
            {
                key: 'formattedResult',
                title: i18next.t('raw-infringement-log.result'),
            },
            // INSERT COLUMNS
        ];

        this.query.filterKeys = [
            {
                key: 'noticeNumber',
                display: i18next.t('infringement.notice_number'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'rawInfringement',
                searchField: 'noticeNumber',
            },
            {
                key: 'client.name',
                display: i18next.t('raw-infringement-log.source'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: ['atg', 'atg-verification', 'manual-upload', 'old-israel-fleet'],
            },
            {
                key: 'status',
                display: i18next.t('raw-infringement-log.status'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: [RawInfringementStatus.Failed, RawInfringementStatus.Completed, RawInfringementStatus.Pending],
            },
            {
                key: 'createdAt',
                display: i18next.t('raw-infringement-log.timestamp'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            timestamp: this.timestampTemplate,
            isSuccessful: this.isSuccessfulTemplate,
            source: this.sourceTemplate,
            formattedRawInfringement: this.formattedRawInfringementTemplate,
            formattedResult: this.formattedResultTemplate,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }

        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewRawInfringementLog(rawInfringementLogId: number) {
        if (!rawInfringementLogId) {
            this.logger.warn('Tried to view an RawInfringementLog without an rawInfringementLog id');
            return;
        }

        // this.router.navigate(['/home', 'logs', 'raw-infringement', rawInfringementLogId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'logs', 'raw-infringement', rawInfringementLogId]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
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
}
