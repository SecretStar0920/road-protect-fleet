import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { Store } from '@ngrx/store';
import i18next from 'i18next';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { PartialInfringementQueryService } from '@modules/admin-partial-infringement/services/partial-infringement-query.service';
import {
    partialInfringementNgrxHelper,
    PartialInfringementState,
} from '@modules/admin-partial-infringement/ngrx/partial-infringement.reducer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PartialInfringementStatus } from '@modules/shared/models/entities/partial-infringement.model';
import { RawInfringementStatus } from '@modules/shared/models/entities/raw-infringement-log.model';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-partial-infringement-advanced',
    templateUrl: './view-partial-infringement-advanced.component.html',
    providers: [
        AdvancedFilterTableService,
        AdvancedQueryFilterService,
        { provide: ApiQueryService, useClass: PartialInfringementQueryService },
    ],
    styleUrls: ['./view-partial-infringement-advanced.component.less'],
})
export class ViewPartialInfringementAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    viewPartialInfringementModal: NzModalRef<any>;
    partialInfringementStatus = PartialInfringementStatus;

    @ViewChild('action', { static: true }) action: TemplateRef<any>;

    @ViewChild('createdAt', { static: true }) createdAtTemplate: TemplateRef<any>;
    @ViewChild('status', { static: true }) statusTemplate: TemplateRef<any>;
    @ViewChild('noticeNumber', { static: true }) noticeNumberTemplate: TemplateRef<any>;
    @ViewChild('processedDate', { static: true }) processedDateTemplate: TemplateRef<any>;
    @ViewChild('formattedDetails', { static: true }) formattedDetailsTemplate: TemplateRef<any>;
    @ViewChild('formattedResponse', { static: true }) formattedResponseTemplate: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;

    private destroy$ = new Subject();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<PartialInfringementState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.partialInfringementTable }));
        this.table.ngrxHelper = partialInfringementNgrxHelper;
        this.table.options.primaryColumnKey = 'partialInfringementId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'partialInfringementId',
                title: i18next.t('partial-infringement.id'),
            },
            {
                key: 'createdAt',
                title: i18next.t('partial-infringement.created_at'),
            },
            {
                key: 'formattedDetails',
                title: i18next.t('partial-infringement.details'),
            },
            {
                key: 'noticeNumber',
                title: i18next.t('partial-infringement.notice_number'),
            },
            {
                key: 'status',
                title: i18next.t('partial-infringement.status'),
            },
            {
                key: 'processedDate',
                title: i18next.t('partial-infringement.processed_date'),
            },
            {
                key: 'formattedResponse',
                title: i18next.t('partial-infringement.response'),
            },
        ];

        this.query.filterKeys = [
            {
                key: 'noticeNumber',
                display: i18next.t('partial-infringement.notice_number'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'partialInfringement',
                searchField: 'noticeNumber',
            },
            {
                key: 'createdAt',
                display: i18next.t('partial-infringement.created_at'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'status',
                display: i18next.t('raw-infringement-log.status'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: Object.values(PartialInfringementStatus),
            },
            {
                key: 'processedDate',
                display: i18next.t('partial-infringement.processed_date'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            createdAt: this.createdAtTemplate,
            formattedDetails: this.formattedDetailsTemplate,
            status: this.statusTemplate,
            noticeNumber: this.noticeNumberTemplate,
            processedDate: this.processedDateTemplate,
            formattedResponse: this.formattedResponseTemplate,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }

        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewPartialInfringement(partialInfringementId: number) {
        if (!partialInfringementId) {
            this.logger.warn('Tried to view a PartialInfringement without an partialInfringementId');
            return;
        }
        // this.router.navigate(['/home', 'partial-infringement', 'view', partialInfringementId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'partial-infringement', 'view', partialInfringementId]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    processedStatus(status: PartialInfringementStatus) {
        return !(status === PartialInfringementStatus.Pending || status === PartialInfringementStatus.Queued);
    }
}
