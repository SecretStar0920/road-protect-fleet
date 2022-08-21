import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { RequestInformationLogQueryService } from '@modules/admin-log/request-information-log/services/request-information-log-query.service';
import {
    requestInformationLogNgrxHelper,
    RequestInformationLogState,
} from '@modules/admin-log/request-information-log/ngrx/request-information-log.reducer';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-request-information-logs-advanced',
    templateUrl: './view-request-information-logs-advanced.component.html',
    providers: [
        AdvancedFilterTableService,
        AdvancedQueryFilterService,
        { provide: ApiQueryService, useClass: RequestInformationLogQueryService },
    ],
    styleUrls: ['./view-request-information-logs-advanced.component.less'],
})
export class ViewRequestInformationLogsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('issuer', { static: true }) issuer: TemplateRef<any>;
    @ViewChild('senderAccount', { static: true }) senderAccount: TemplateRef<any>;
    @ViewChild('requestSendDate', { static: true }) requestSendDate: TemplateRef<any>;
    @ViewChild('responseReceivedDate', { static: true }) responseReceivedDate: TemplateRef<any>;
    @ViewChild('responseReceived', { static: true }) responseReceived: TemplateRef<any>;

    currency = environment.currency;
    private destroy$ = new Subject();

    account: Account;

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<RequestInformationLogState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();

        this.store.pipe(select(getSelectedAccount), takeUntil(this.destroy$)).subscribe((result) => {
            this.account = result.account;
        });
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.infoRequestLogsTable }));
        this.table.ngrxHelper = requestInformationLogNgrxHelper;
        this.table.options.primaryColumnKey = 'requestInformationLogId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'requestSendDate',
                title: i18next.t('request_information_log.request_send_date'),
            },
            {
                key: 'senderAccount.name',
                title: i18next.t('request_information_log.account'),
            },
            {
                key: 'issuer.name',
                title: i18next.t('request_information_log.issuer'),
            },
            {
                key: 'responseReceived',
                title: i18next.t('request_information_log.response_received'),
            },
            {
                key: 'responseReceivedDate',
                title: i18next.t('request_information_log.response_received_date'),
            },
        ];

        this.query.filterKeys = [
            {
                key: 'requestSendDate',
                type: FilterKeyType.Date,
                display: i18next.t('request_information_log.request_send_date'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'senderAccount.name',
                display: i18next.t('request_information_log.account'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'account',
                searchField: 'name',
            },
            {
                key: 'issuer.name',
                display: i18next.t('request_information_log.issuer'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'issuer',
                searchField: 'name',
            },
            {
                key: 'responseReceived',
                type: FilterKeyType.Boolean,
                display: i18next.t('request_information_log.response_received'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'responseReceivedDate',
                type: FilterKeyType.Date,
                display: i18next.t('request_information_log.response_received_date'),
                visibility: FilterKeyVisibility.Simple,
            },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            'issuer.name': this.issuer,
            'senderAccount.name': this.senderAccount,
            requestSendDate: this.requestSendDate,
            responseReceivedDate: this.responseReceivedDate,
            responseReceived: this.responseReceived,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewRequestInformationLog(requestInformationLogId: number) {
        if (!requestInformationLogId) {
            this.logger.warn('Tried to view an RequestInformationLog without an requestInformationLog id');
            return;
        }
        // this.router.navigate(['/home', 'request-information-log', 'view', requestInformationLogId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['/home', 'request-information-log', 'view', requestInformationLogId]),
        );
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
