import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    integrationRequestLogNgrxHelper,
    IntegrationRequestLogState,
} from '@modules/admin-log/integration-request-log/ngrx/integration-request-log.reducer';
import { IntegrationRequestLogQueryService } from '@modules/admin-log/integration-request-log/services/integration-request-log-query.service';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { Integration } from '@modules/shared/models/entities/integration-request-log.model';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { Store } from '@ngrx/store';
import i18next from 'i18next';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-integration-request-logs-advanced',
    templateUrl: './view-integration-request-logs-advanced.component.html',
    providers: [
        AdvancedFilterTableService,
        AdvancedQueryFilterService,
        { provide: ApiQueryService, useClass: IntegrationRequestLogQueryService },
    ],
    styleUrls: ['./view-integration-request-logs-advanced.component.less'],
})
export class ViewIntegrationRequestLogsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    viewIntegrationRequestLogModal: NzModalRef<any>;

    @ViewChild('action', { static: true }) action: TemplateRef<any>;

    @ViewChild('timestamp', { static: true }) timestampTemplate: TemplateRef<any>;
    @ViewChild('source', { static: true }) sourceTemplate: TemplateRef<any>;
    @ViewChild('isSuccessful', { static: true }) isSuccessfulTemplate: TemplateRef<any>;
    @ViewChild('formattedRequest', { static: true }) formattedRequestTemplate: TemplateRef<any>;
    @ViewChild('formattedResponse', { static: true }) formattedResponseTemplate: TemplateRef<any>;

    private destroy$ = new Subject();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<IntegrationRequestLogState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        // this.table.pageDataSelector = integrationRequestLogSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.integrationRequestLogsTable }));
        this.table.ngrxHelper = integrationRequestLogNgrxHelper;
        this.table.options.primaryColumnKey = 'integrationRequestLogId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'integrationRequestLogId',
                title: i18next.t('integration-request-log.integration_request_log_id'),
            },
            {
                key: 'timestamp',
                title: i18next.t('integration-request-log.timestamp'),
            },
            {
                key: 'isSuccessful',
                title: i18next.t('integration-request-log.success'),
            },
            {
                key: 'source',
                title: i18next.t('integration-request-log.type'),
            },
            {
                key: 'formattedRequest',
                title: i18next.t('integration-request-log.request'),
            },
            {
                key: 'formattedResponse',
                title: i18next.t('integration-request-log.response'),
            },
            // INSERT COLUMNS
        ];

        this.query.filterKeys = [
            {
                key: 'type',
                display: i18next.t('integration-request-log.type'),
                type: FilterKeyType.Dropdown,
                visibility: FilterKeyVisibility.Simple,
                options: [
                    Integration.AutomationAddVehicle,
                    Integration.AutomationRedirectInfringement,
                    Integration.AutomationUpdateVehicle,
                    Integration.AutomationVerifyInfringement,
                    Integration.AutomationVerifyInfringementSum,
                    Integration.OldFleetInfringementData,
                    Integration.JerusalemVerifyInfringement,
                    Integration.TelavivVerifyInfringement,
                    Integration.MileonVerifyInfringement,
                    Integration.MetroparkVerifyInfringement,
                    Integration.KfarSabaVerifyInfringement,
                    Integration.PoliceVerifyInfringement,
                    Integration.ShoharVerifyInfringement,
                    Integration.ContractOCR,
                    Integration.TelavivRedirectInfringement,
                    Integration.JerusalemRedirectInfringement,
                ],
            },
            {
                key: 'success',
                display: i18next.t('integration-request-log.success'),
                type: FilterKeyType.Boolean,
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'createdAt',
                display: i18next.t('integration-request-log.timestamp'),
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
            formattedRequest: this.formattedRequestTemplate,
            formattedResponse: this.formattedResponseTemplate,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }

        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewIntegrationRequestLog(integrationRequestLogId: number) {
        if (!integrationRequestLogId) {
            this.logger.warn('Tried to view an IntegrationRequestLog without an integrationRequestLog id');
            return;
        }
        // this.router.navigate(['/home', 'logs', 'integration-request', integrationRequestLogId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'logs', 'integration-request', integrationRequestLogId]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
