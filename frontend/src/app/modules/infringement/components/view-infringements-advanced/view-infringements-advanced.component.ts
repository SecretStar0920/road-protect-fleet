import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
    Infringement,
    InfringementStatus,
    InfringementSystemStatus,
    InfringementTag,
    InfringementType,
} from '@modules/shared/models/entities/infringement.model';
import { select, Store } from '@ngrx/store';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { Subject } from 'rxjs';
import { CreateInfringementModalComponent } from '@modules/infringement/components/create-infringement/create-infringement-modal/create-infringement-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import {
    AdvancedFilterTableService,
    AdvancedTableColumn,
} from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { InfringementQueryService } from '@modules/infringement/services/infringement-query.service';
import { NominationType, RedirectionType } from '@modules/shared/models/entities/nomination.model';
import { FilterKey, FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { VehicleType } from '@modules/shared/models/entities/vehicle.model';
import { ContractOcrStatus } from '@modules/shared/models/entities/contract.model';
import { InfringementNote } from '@modules/shared/models/entities/infringement-note.model';
import * as moment from 'moment';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateInfringementComponent } from '@modules/infringement/components/update-infringement/update-infringement.component';
import { AuthState, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { User, UserType } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-view-infringements-advanced',
    templateUrl: './view-infringements-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: InfringementQueryService }],
    styleUrls: ['./view-infringements-advanced.component.less'],
})
export class ViewInfringementsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    // Templates
    @ViewChild('offenceDate', { static: true }) offenceDate: TemplateRef<any>;
    @ViewChild('notes', { static: true }) notes: TemplateRef<any>;
    @ViewChild('tags', { static: true }) tags: TemplateRef<any>;
    @ViewChild('approvedDate', { static: true }) approvedDate: TemplateRef<any>;
    @ViewChild('paidDate', { static: true }) paidDate: TemplateRef<any>;
    @ViewChild('latestPaymentDate', { static: true }) latestPaymentDate: TemplateRef<any>;
    @ViewChild('uploadDate', { static: true }) uploadDate: TemplateRef<any>;
    @ViewChild('amountDue', { static: true }) amountDue: TemplateRef<any>;
    @ViewChild('originalAmount', { static: true }) originalAmount: TemplateRef<any>;
    @ViewChild('penaltyAmount', { static: true }) penaltyAmount: TemplateRef<any>;
    @ViewChild('totalAmount', { static: true }) totalAmount: TemplateRef<any>;
    @ViewChild('totalPayments', { static: true }) totalPayments: TemplateRef<any>;
    @ViewChild('vehicle', { static: true }) vehicle: TemplateRef<any>;
    @ViewChild('issuer', { static: true }) issuer: TemplateRef<any>;
    @ViewChild('status', { static: true }) status: TemplateRef<any>;
    @ViewChild('reason', { static: true }) reason: TemplateRef<any>;
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @ViewChild('location', { static: true }) location: TemplateRef<any>;
    @ViewChild('nominationAccount', { static: true }) nominationAccount: TemplateRef<any>;
    @ViewChild('userAccount', { static: true }) userAccount: TemplateRef<any>;
    @ViewChild('ownerAccount', { static: true }) ownerAccount: TemplateRef<any>;
    @ViewChild('nominationStatus', { static: true }) nominationStatus: TemplateRef<any>;
    @ViewChild('redirectionError', { static: true }) redirectionError: TemplateRef<any>;
    @ViewChild('systemStatus', { static: true }) systemStatus: TemplateRef<any>;
    @ViewChild('redirectedDate', { static: true }) redirectedDate: TemplateRef<any>;
    @ViewChild('redirectionLetterSendDate', { static: true }) redirectionLetterSendDate: TemplateRef<any>;
    @ViewChild('externalChangeDate', { static: true }) externalChangeDate: TemplateRef<any>;
    @ViewChild('lastStatusChangeDate', { static: true }) lastStatusChangeDate: TemplateRef<any>;
    @ViewChild('lastNominationStatusChangeDate', { static: true }) lastNominationStatusChangeDate: TemplateRef<any>;
    @ViewChild('mergedDocumentUpdatedDate', { static: true }) mergedDocumentUpdatedDate: TemplateRef<any>;
    @ViewChild('brnAccount', { static: true }) brnAccount: TemplateRef<any>;
    @ViewChild('ocrStatus', { static: true }) ocrStatus: TemplateRef<any>;
    @ViewChild('contractDocumentCreationDate', { static: true }) contractDocumentCreationDate: TemplateRef<any>;
    @ViewChild('contractDocument', { static: true }) contractDocument: TemplateRef<any>;
    @ViewChild('creationMethod', { static: true }) creationMethod: TemplateRef<any>;

    createInfringementModal: NzModalRef<any>;
    editInfringementModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    private _vehicleId: number;

    @Input() showBatchActions: boolean = true;

    @Input() useCustomFilters: boolean = false;
    private _customFilter: string = 'onVehicles';
    get customFilter(): string {
        return this._customFilter;
    }

    set customFilter(value: string) {
        this.store.dispatch(infringementNgrxHelper.setQueryParams({ query: { via: value } }));
    }

    get vehicleId(): number {
        return this._vehicleId;
    }

    @Input()
    set vehicleId(value: number) {
        this._vehicleId = value;
        this.query.fixedFilters = [
            {
                field: 'vehicle.vehicleId',
                operator: 'eq',
                value: this._vehicleId,
            },
        ];
    }

    account: Account;
    @Input() filterVisibility: FilterKeyVisibility = FilterKeyVisibility.Simple;

    private availableFilterKeys: FilterKey[] = []
    private availableDefaultColumns: AdvancedTableColumn[] = []

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<InfringementState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
        private authStore: Store<AuthState>,
    ) {
        this.query.limit = 30;
        this.configureTable();
        this.store.pipe(select(infringementNgrxHelper.selectQueryParams()), takeUntil(this.destroy$)).subscribe((result) => {
            this._customFilter = result.via;
            this.query.refreshData();
        });

        this.store.pipe(select(getSelectedAccount), takeUntil(this.destroy$)).subscribe((result) => {
            this.account = result.account;
        });
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.infringementTable }));
        this.table.ngrxHelper = infringementNgrxHelper;
        this.table.options.primaryColumnKey = 'infringementId';
        this.table.options.enableRowSelect = true;

        this.availableFilterKeys = [
            {
                key: 'noticeNumber',
                display: i18next.t('infringement.notice_number'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'infringement',
                searchField: 'noticeNumber',
            },
            {
                key: 'infringementId',
                display: i18next.t('infringement.infringement_id'),
                type: FilterKeyType.Number,
                enableSearch: true,
                visibility: FilterKeyVisibility.Simple,
                searchEntity: 'infringement',
                searchField: 'infringementId',
            },
            {
                key: 'lastSuccessfulPayment.externalReference',
                display: i18next.t('view-infringement-advanced.external_payment_reference'),
                type: FilterKeyType.String,
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'brn',
                display: i18next.t('infringement.brn'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'infringement',
                searchField: 'brn',
            },
            {
                key: 'vehicle.registration',
                display: i18next.t('infringement.vehicle_registration'),
                visibility: FilterKeyVisibility.Simple,
                type: FilterKeyType.ExactString,
                enableSearch: true,
                searchEntity: 'vehicle',
                searchField: 'registration',
            },
            {
                key: 'status',
                type: FilterKeyType.Dropdown,
                options: Object.values(InfringementStatus),
                display: i18next.t('infringement.status'),
                visibility: FilterKeyVisibility.Simple,
            },
            { key: 'issuerStatus', display: i18next.t('infringement.issuer_status'), visibility: FilterKeyVisibility.Detailed },
            {
                key: 'issuer.name',
                display: i18next.t('infringement.issuer'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'issuer',
                searchField: 'name',
            },
            {
                key: 'issuer.provider',
                display: i18next.t('issuer.provider'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'issuer',
                searchField: 'provider',
            },
            {
                key: 'originalAmount',
                type: FilterKeyType.Number,
                display: i18next.t('infringement.original_amount'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'amountDue',
                type: FilterKeyType.Number,
                display: i18next.t('infringement.amount_due'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'penaltyAmount',
                type: FilterKeyType.Number,
                display: i18next.t('infringement.penalty_amount'),
                visibility: FilterKeyVisibility.Simple,
                sortable: false,
            },
            {
                key: 'totalAmount',
                type: FilterKeyType.Number,
                display: i18next.t('infringement.total_amount'),
                visibility: FilterKeyVisibility.Simple,
                sortable: false,
            },
            {
                key: 'totalPayments',
                type: FilterKeyType.Number,
                display: i18next.t('infringement.total_payments'),
                visibility: FilterKeyVisibility.Simple,
                sortable: false,
            },
            {
                key: 'type',
                type: FilterKeyType.Dropdown,
                options: Object.values(InfringementType),
                display: i18next.t('infringement.type'),
                visibility: FilterKeyVisibility.Detailed,
            },
            { key: 'reason', display: i18next.t('infringement.reason'), visibility: FilterKeyVisibility.Simple },
            { key: 'reasonCode', display: i18next.t('infringement.reason_code') },
            { key: 'caseNumber', display: i18next.t('infringement.case_number'), visibility: FilterKeyVisibility.Detailed },
            {
                key: 'nomination.status',
                type: FilterKeyType.Dropdown,
                options: ['New', 'In Redirection Process', 'Closed', 'Redirection Completed', 'Redirection Error', 'Redirection Request Error'],
                display: i18next.t('view-infringement-advanced.nomination_status'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'account.name',
                display: i18next.t('view-infringement-advanced.nominated_account'),
                visibility: FilterKeyVisibility.Detailed,
                columnKey: 'nomination.account',
                enableSearch: true,
                searchEntity: 'account',
                searchField: 'name',
            },
            {
                key: 'contractUser.name',
                display: i18next.t('view-infringement-advanced.contract_user'),
                visibility: FilterKeyVisibility.Simple,
                columnKey: 'infringementContract.user',
                enableSearch: true,
                searchEntity: 'account',
                searchField: 'name',
            },
            {
                key: 'contractOwner.name',
                display: i18next.t('view-infringement-advanced.contract_owner'),
                visibility: FilterKeyVisibility.Simple,
                columnKey: 'infringementContract.owner',
                enableSearch: true,
                searchEntity: 'account',
                searchField: 'name',
            },
            {
                key: 'offenceDate',
                type: FilterKeyType.Date,
                display: i18next.t('infringement.date_of_offence'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'nomination.mergedDocumentUpdatedDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.redirection_document_update_date'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'latestPaymentDate',
                type: FilterKeyType.Date,
                display: i18next.t('infringement.latest_payment_date'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'nomination.rawRedirectionIdentifier',
                type: FilterKeyType.ExactString,
                display: i18next.t('view-infringement-advanced.raw_redirection_identifier'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'nomination',
                searchField: 'rawRedirectionIdentifier',
            },
            {
                key: 'nomination.rawRedirectionIdentifier',
                type: FilterKeyType.Existence,
                display: i18next.t('view-infringement-advanced.raw_redirection_identifier_exists'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'nomination.redirectionType',
                type: FilterKeyType.Dropdown,
                options: Object.values(RedirectionType),
                display: i18next.t('view-infringement-advanced.redirection_type'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'nomination.externalRedirectionReference',
                type: FilterKeyType.ExactString,
                display: i18next.t('view-infringement-advanced.external_redirection_reference'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'infringementContract.document',
                type: FilterKeyType.Existence,
                display: i18next.t('view-infringement-advanced.lease_contract_pdf'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'infringementContract.ocrStatus',
                display: i18next.t('view-infringement-advanced.ocr_status'),
                type: FilterKeyType.Dropdown,
                options: Object.keys(ContractOcrStatus),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'account.powerOfAttorney',
                type: FilterKeyType.Existence,
                display: i18next.t('view-infringement-advanced.power_of_attorney_pdf'),
                visibility: FilterKeyVisibility.Detailed,
            },
            { key: 'createdAt', type: FilterKeyType.Date, display: i18next.t('view-infringement-advanced.date_uploaded') },
            {
                key: 'externalChangeDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.external_change_date'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'location.country',
                display: i18next.t('infringement.country'),
                enableSearch: true,
                searchEntity: 'location',
                searchField: 'country',
            },
            { key: 'location.code', display: i18next.t('infringement.code') },
            {
                key: 'systemStatus',
                type: FilterKeyType.Dropdown,
                options: Object.values(InfringementSystemStatus),
                display: i18next.t('view-infringement-advanced.system_status'),
                sortable: false,
            },
            {
                key: 'lastStatusChangeDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.last_infringement_status_change_date'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'nomination.lastStatusChangeDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.last_nomination_status_change_date'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'vehicle.type',
                type: FilterKeyType.Dropdown,
                display: i18next.t('view-infringement-advanced.vehicle_type'),
                options: Object.values(VehicleType as any),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'approvedDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.approved_date'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'nomination.paidDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.paid_date'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'nomination.redirectionLetterSendDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.redirection_letter_send_date'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'nomination.redirectedDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-infringement-advanced.redirected_date'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'tags',
                type: FilterKeyType.Dropdown,
                options: Object.values(InfringementTag),
                display: i18next.t('view-infringement-advanced.tags'),
                visibility: FilterKeyVisibility.Simple,
                sortable: false,
            }
        ];

        this.availableDefaultColumns = [
            { key: 'vehicle.registration', title: i18next.t('infringement.vehicle') },
            {
                key: 'infringementContract.owner',
                spreadsheetKey: 'contract.owner.name',
                title: i18next.t('view-infringement-advanced.contract_owner'),
            },
            { key: 'noticeNumber', title: i18next.t('infringement.notice_number') },
            { key: 'infringementId', title: i18next.t('infringement.infringement_id') },
            { key: 'offenceDate', title: i18next.t('infringement.date_of_offence'), spreadsheetFormat: 'date' },
            { key: 'issuer.name', title: i18next.t('infringement.issuer') },
            { key: 'status', title: i18next.t('infringement.status') },
            { key: 'reason', title: i18next.t('infringement.reason') },
            { key: 'location', title: i18next.t('view-infringement-advanced.location'), spreadsheetKey: 'location.address' },
            { key: 'originalAmount', title: i18next.t('infringement.original_amount'), spreadsheetFormat: 'currency' },
            { key: 'penaltyAmount', title: i18next.t('infringement.penalty_amount'), spreadsheetFormat: 'currency' },
            { key: 'amountDue', title: i18next.t('infringement.amount_due'), spreadsheetFormat: 'currency' },
            {
                key: 'latestPaymentDate',
                title: i18next.t('infringement.latest_payment_date'),
                spreadsheetFormat: 'date',
            },
            { key: 'nomination.status', title: i18next.t('view-infringement-advanced.nomination_status') },
            { key: 'nomination.redirectionError', title: i18next.t('view-infringement-advanced.redirection_error') },
            {
                key: 'nomination.account',
                spreadsheetKey: 'nomination.account.name',
                isDisplaying: false,
                title: i18next.t('view-infringement-advanced.nominated_account'),
            },
            {
                key: 'infringementContract.user',
                spreadsheetKey: 'contract.user.name',
                isDisplaying: false,
                title: i18next.t('view-infringement-advanced.contract_user'),
            },
            { key: 'brn', title: i18next.t('view-infringement-advanced.brn'), isDisplaying: false },
            { key: 'notes', title: i18next.t('view-infringement-advanced.notes'), isDisplaying: false, spreadsheetKey: 'notes[0].value' },
            {
                key: 'brnAccount',
                title: i18next.t('view-infringement-advanced.brn_account'),
                spreadsheetKey: 'brnAccount.name',
                isDisplaying: false,
            },
            { key: 'totalAmount', title: i18next.t('infringement.total_amount'), spreadsheetFormat: 'currency', isDisplaying: false },
            { key: 'totalPayments', title: i18next.t('infringement.total_payments'), spreadsheetFormat: 'currency', isDisplaying: false },
            {
                key: 'infringementContract.ocrStatus',
                spreadsheetKey: 'contract.ocrStatus',
                title: i18next.t('view-infringement-advanced.ocr_status'),
                isDisplaying: false,
            },
            {
                key: 'infringementContract.document',
                spreadsheetKey: 'contract.document',
                title: i18next.t('view-infringement-advanced.contract_pdf'),
                isDisplaying: false,
            },
            {
                key: 'document.createdAt',
                spreadsheetKey: 'contract.document.createdAt',
                title: i18next.t('view-infringement-advanced.contract_pdf_created'),
                isDisplaying: false,
            },
            { key: 'issuerStatus', title: i18next.t('infringement.issuer_status'), isDisplaying: false },
            { key: 'issuer.provider', title: i18next.t('issuer.provider'), isDisplaying: false },
            { key: 'type', title: i18next.t('infringement.type'), isDisplaying: false },
            { key: 'reasonCode', title: i18next.t('infringement.reason_code'), isDisplaying: false },
            { key: 'caseNumber', title: i18next.t('infringement.case') + ' #', isDisplaying: false },
            {
                key: 'approvedDate',
                title: i18next.t('view-infringement-advanced.approved_date'),
                isDisplaying: false,
                spreadsheetFormat: 'date',
            },
            {
                key: 'nomination.paidDate',
                title: i18next.t('view-infringement-advanced.paid_date'),
                isDisplaying: false,
                spreadsheetFormat: 'date',
            },
            {
                key: 'lastSuccessfulPayment.externalReference',
                title: i18next.t('view-infringement-advanced.external_payment_reference'),
                isDisplaying: false,
            },
            {
                key: 'nomination.redirectionLetterSendDate',
                title: i18next.t('view-infringement-advanced.redirection_letter_send_date'),
                isDisplaying: false,
                spreadsheetFormat: 'date',
            },
            {
                key: 'creationMethod',
                title: i18next.t('view-infringement-advanced.creationMethod'),
                isDisplaying: false,
            },
            {
                key: 'user.email',
                title: i18next.t('view-infringement-advanced.creation_user'),
                isDisplaying: false,
            },
            {
                key: 'nomination.redirectedDate',
                title: i18next.t('view-infringement-advanced.redirected_date'),
                isDisplaying: false,
                spreadsheetFormat: 'date',
            },
            {
                key: 'nomination.redirectionType',
                title: i18next.t('view-infringement-advanced.redirection_type'),
                isDisplaying: false,
            },
            {
                key: 'nomination.externalRedirectionReference',
                title: i18next.t('view-infringement-advanced.external_redirection_reference'),
                isDisplaying: false,
            },
            {
                key: 'createdAt',
                title: i18next.t('view-infringement-advanced.date_uploaded'),
                isDisplaying: false,
                spreadsheetFormat: 'date',
            },
            {
                key: 'externalChangeDate',
                title: i18next.t('view-infringement-advanced.external_change_date'),
                isDisplaying: false,
                spreadsheetFormat: 'date',
            },
            {
                key: 'nomination.rawRedirectionIdentifier',
                title: i18next.t('view-infringement-advanced.raw_redirection_identifier'),
                isDisplaying: false,
            },
            {
                key: 'lastStatusChangeDate',
                title: i18next.t('view-infringement-advanced.last_infringement_status_change_date'),
                isDisplaying: false,
            },
            {
                key: 'nomination.lastStatusChangeDate',
                title: i18next.t('view-infringement-advanced.last_nomination_status_change_date'),
                isDisplaying: false,
            },
            {
                key: 'nomination.mergedDocumentUpdatedDate',
                title: i18next.t('view-infringement-advanced.redirection_document_update_date'),
                isDisplaying: false,
            },
            {
                key: 'vehicle.type',
                title: i18next.t('view-infringement-advanced.vehicle_type'),
                isDisplaying: false,
            },
            { key: 'tags', title: i18next.t('infringement.tags') },
        ];
    }

    ngOnInit() {
        /**
         * Custom displays
         */
        this.table.templateColumns = {
            tags: this.tags,
            systemStatus: this.systemStatus,
            offenceDate: this.offenceDate,
            notes: this.notes,
            latestPaymentDate: this.latestPaymentDate,
            createdAt: this.uploadDate,
            externalChangeDate: this.externalChangeDate,
            approvedDate: this.approvedDate,
            'nomination.paidDate': this.paidDate,
            'nomination.redirectedDate': this.redirectedDate,
            'nomination.redirectionLetterSendDate': this.redirectionLetterSendDate,
            'issuer.name': this.issuer,
            'vehicle.registration': this.vehicle,
            'nomination.status': this.nominationStatus,
            'nomination.redirectionError': this.redirectionError,
            'nomination.account': this.nominationAccount,
            'infringementContract.user': this.userAccount,
            'infringementContract.owner': this.ownerAccount,
            amountDue: this.amountDue,
            originalAmount: this.originalAmount,
            penaltyAmount: this.penaltyAmount,
            totalAmount: this.totalAmount,
            totalPayments: this.totalPayments,
            status: this.status,
            reason: this.reason,
            location: this.location,
            lastStatusChangeDate: this.lastStatusChangeDate,
            'nomination.mergedDocumentUpdatedDate': this.mergedDocumentUpdatedDate,
            brnAccount: this.brnAccount,
            creationMethod: this.creationMethod,
            'nomination.lastStatusChangeDate': this.lastNominationStatusChangeDate,
             'contract.ocrStatus': this.ocrStatus,
            'document.createdAt': this.contractDocumentCreationDate,
            'infringementContract.document': this.contractDocument,
        };

        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }

        this.authStore.pipe(select(currentUser), takeUntil(this.destroy$)).subscribe((user) => {
            this.updateTableColumns(user)
        });

        this.table.selectDataFromStore();
    }

    private updateTableColumns(user: User) {
        let tagsAreAvailable = user.type === UserType.Admin || user.type === UserType.Developer

        if (tagsAreAvailable) {
            this.table.defaultColumns = this.availableDefaultColumns
            this.query.filterKeys = this.availableFilterKeys
        } else {
            this.table.defaultColumns = this.availableDefaultColumns.filter( (column) => column.key !== 'tags')
            this.query.filterKeys = this.availableFilterKeys.filter( (filter) => filter.key !== 'tags')
        }
    }

    ngAfterViewInit(): void {}

    getMostRecentNote(notes: InfringementNote[]): string {
        if (!notes || notes.length < 1) {
            return '--';
        }
        const note = notes.reduce((a, b) => {
            return moment(a.createdAt).isAfter(moment(b.createdAt)) ? a : b;
        });
        if (note?.value) {
            return note.value;
        }
        return '--';
    }

    onCreateInfringement() {
        this.createInfringementModal = this.modalService.create({
            nzTitle: i18next.t('view-infringement-advanced.create_infringement'),
            nzContent: CreateInfringementModalComponent,
            nzFooter: null,
            nzWidth: 900,
            nzComponentParams: {},
        });
    }

    onEditInfringement(infringement: Infringement) {
        this.editInfringementModal = this.modalService.create({
            nzTitle: i18next.t('view-infringement-advanced.edit_infringement'),
            nzContent: UpdateInfringementComponent,
            nzFooter: null,
            nzWidth: 900,
            nzComponentParams: { infringement },
        });
        this.editInfringementModal.componentInstance.complete.subscribe((result) => {
            this.editInfringementModal.close();
        });
    }

    onViewInfringement(infringementId: number) {
        if (!infringementId) {
            this.logger.warn('Tried to view an Infringement without an infringement id');
            return;
        }
        // this.router.navigate(['/home', 'infringements', 'view', infringementId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'infringements', 'view', infringementId]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
