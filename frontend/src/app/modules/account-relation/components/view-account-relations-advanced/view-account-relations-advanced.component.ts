import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { select, Store } from '@ngrx/store';
import { accountRelationNgrxHelper, AccountRelationState } from '@modules/account-relation/ngrx/account-relation.reducer';
import { Subject } from 'rxjs';
import { CreateAccountRelationModalComponent } from '@modules/account-relation/components/create-account-relation/create-account-relation-modal/create-account-relation-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AccountRelationQueryService } from '@modules/account-relation/services/account-relation-query.service';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { EmailAccountRelationInfringementReportComponent } from '@modules/account-relation/components/email-account-relation-infringement-report/email-account-relation-infringement-report.component';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateAccountRelationComponent } from '@modules/account-relation/components/update-account-relation/update-account-relation.component';
import { UploadRelationsSpreadsheet } from '@modules/account-relation/components/upload-relations-spreadsheet/upload-relations-spreadsheet.component';
import { UploadRelationsSpreadsheetModalComponent } from '@modules/account-relation/components/upload-relations-spreadsheet/upload-relations-spreadsheet-modal/upload-relations-spreadsheet-modal.component';

@Component({
    selector: 'rp-view-account-relations-advanced',
    templateUrl: './view-account-relations-advanced.component.html',
    providers: [
        AdvancedFilterTableService,
        AdvancedQueryFilterService,
        { provide: ApiQueryService, useClass: AccountRelationQueryService },
    ],
    styleUrls: ['./view-account-relations-advanced.component.less'],
})
export class ViewAccountRelationsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    // TODO Templates
    @ViewChild('forwardAccount', { static: true }) forwardAccount: TemplateRef<any>;
    @ViewChild('reverseAccount', { static: true }) reverseAccount: TemplateRef<any>;
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;

    createAccountRelationModal: NzModalRef<any>;
    editAccountRelationModal: NzModalRef<any>;
    uploadAccountRelationSpreadsheetModal: NzModalRef<UploadRelationsSpreadsheetModalComponent>;
    sendAccountRelationInfringementReportModal: NzModalRef<any>;
    currency = environment.currency;
    permissions = PERMISSIONS;
    private destroy$ = new Subject();

    account: Account;

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<AccountRelationState>,
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
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.relationTable }));
        this.table.ngrxHelper = accountRelationNgrxHelper;
        this.table.options.primaryColumnKey = 'accountRelationId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            { key: 'forward', spreadsheetKey: 'forward.name', title: i18next.t('account-relation.forward') },
            // { key: 'reverse', title: i18next.t('account-relation.reverse') },
            { key: 'data.summary', title: i18next.t('account-relation.summary') },
        ];

        this.query.filterKeys = [
            {
                key: 'forward.name',
                display: i18next.t('account-relation.filter_forward_name'),
                visibility: FilterKeyVisibility.Simple,
                columnKey: 'forward',
            },
            {
                key: 'forward.identifier',
                display: i18next.t('account-relation.filter_forward_identifier'),
                visibility: FilterKeyVisibility.Simple,
            },
            // { key: 'reverse.name', display: i18next.t('account-relation.filter_reverse_name') },
            // { key: 'reverse.identifier', display: i18next.t('account-relation.filter_reverse_identifier') },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            forward: this.forwardAccount,
            reverse: this.reverseAccount,
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

    onCreateAccountRelation() {
        this.createAccountRelationModal = this.modalService.create({
            nzTitle: i18next.t('view-account-relation-advanced.create_account-relation'),
            nzContent: CreateAccountRelationModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onViewAccountRelation(accountRelationId: number) {
        if (!accountRelationId) {
            this.logger.warn('Tried to view an Account Relation without an accountRelation id');
            return;
        }
        // this.router.navigate(['/home', 'account-relations', 'view', accountRelationId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'account-relations', 'view', accountRelationId]));
        window.open(url, '_blank');
    }

    onEmailAccountRelation(accountRelation: AccountRelation) {
        this.sendAccountRelationInfringementReportModal = this.modalService.create({
            nzContent: EmailAccountRelationInfringementReportComponent,
            nzFooter: null,
            nzComponentParams: { accountRelation },
        });
    }

    onEditRelation(accountRelation: AccountRelation) {
        this.editAccountRelationModal = this.modalService.create({
            nzTitle: i18next.t('view-account-relation-advanced.edit_account-relation'),
            nzContent: UpdateAccountRelationComponent,
            nzFooter: null,
            nzComponentParams: { accountRelation },
        });

        this.editAccountRelationModal.componentInstance.complete.subscribe((result) => {
            this.editAccountRelationModal.close();
        });
    }

    onUploadRelationsSpreadsheet() {
        this.uploadAccountRelationSpreadsheetModal = this.modalService.create({
            nzTitle: 'Upload spreadsheet',
            nzContent: UploadRelationsSpreadsheetModalComponent,
            nzFooter: null,
            nzComponentParams: {  },
        });

        this.uploadAccountRelationSpreadsheetModal.componentInstance.complete.subscribe((result) => {
            this.uploadAccountRelationSpreadsheetModal.close();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
