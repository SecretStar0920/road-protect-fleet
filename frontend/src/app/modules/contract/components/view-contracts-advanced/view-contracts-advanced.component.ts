import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Observable, Subject } from 'rxjs';
import { CreateContractModalComponent } from '@modules/contract/components/create-contract/create-contract-modal/create-contract-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { ContractQueryService } from '@modules/contract/services/contract-query.service';
import { Contract, ContractOcrStatus, ContractStatus, ContractType } from '@modules/shared/models/entities/contract.model';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { takeUntil } from 'rxjs/operators';
import { BulkCreateLeaseContractDocumentModalComponent } from '@modules/contract/components/bulk-create-lease-contract-document-modal/bulk-create-lease-contract-document-modal.component';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateContractDatesComponent } from '@modules/contract/components/view-contract/update-contract-dates/update-contract-dates.component';
import { bulkOcr } from '@modules/contract/ngrx/contract.actions';
import { contractIsLoading } from '@modules/contract/ngrx/contract.selectors';

@Component({
    selector: 'rp-view-contracts-advanced',
    templateUrl: './view-contracts-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: ContractQueryService }],
    styleUrls: ['./view-contracts-advanced.component.less'],
})
export class ViewContractsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    contracts: Contract[];
    getContractsState: ElementStateModel = new ElementStateModel();
    createContractModal: NzModalRef<any>;
    userDetailsModal: NzModalRef<any>;
    currency = environment.currency;
    updateContractDatesVisible: boolean = false;
    private destroy$ = new Subject();
    selectedContracts: Contract[] = [];
    editContractModal: NzModalRef<any>;
    isLoading$: Observable<boolean> = this.store.pipe(select(contractIsLoading), takeUntil(this.destroy$));

    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('startDate', { static: true }) startDate: TemplateRef<any>;
    @ViewChild('endDate', { static: true }) endDate: TemplateRef<any>;
    @ViewChild('owner', { static: true }) owner: TemplateRef<any>;
    @ViewChild('user', { static: true }) user: TemplateRef<any>;
    @ViewChild('vehicle', { static: true }) vehicle: TemplateRef<any>;
    @ViewChild('current', { static: true }) current: TemplateRef<any>;
    @ViewChild('status', { static: true }) status: TemplateRef<any>;
    @ViewChild('document', { static: true }) document: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @ViewChild('ocrStatus', { static: true }) ocrStatus: TemplateRef<any>;
    @ViewChild('ocr', { static: true }) ocr: TemplateRef<any>;

    @Input() filterVisibility: FilterKeyVisibility = FilterKeyVisibility.Simple;

    private _vehicleId: number;

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

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<ContractState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.contractTable }));
        // this.table.pageDataSelector = contractSelectors.selectAll;
        this.table.ngrxHelper = contractNgrxHelper;
        this.table.options.primaryColumnKey = 'contractId';
        this.table.options.enableRowSelect = true;
        this.table.defaultColumns = [
            { key: 'type', title: i18next.t('view-contracts-advanced.type') },
            { key: 'startDate', title: i18next.t('view-contracts-advanced.start_date'), spreadsheetFormat: 'date' },
            { key: 'endDate', title: i18next.t('view-contracts-advanced.end_date'), spreadsheetFormat: 'date' },
            { key: 'vehicle', spreadsheetKey: 'vehicle.registration', title: i18next.t('view-contracts-advanced.vehicle') },
            // { key: 'currentForVehicle', title: i18next.t('view-contracts-advanced.is_current') },
            { key: 'owner', spreadsheetKey: 'owner.name', title: i18next.t('view-contracts-advanced.owner') },
            { key: 'owner.identifier', spreadsheetKey: 'owner.identifier', title: i18next.t('view-contracts-advanced.owner_brn') },
            { key: 'user', spreadsheetKey: 'user.name', title: i18next.t('view-contracts-advanced.user') },
            { key: 'user.identifier', spreadsheetKey: 'user.identifier', title: i18next.t('view-contracts-advanced.user_brn') },
            { key: 'document', spreadsheetKey: 'document.fileName', title: i18next.t('view-contracts-advanced.document') },
            { key: 'status', title: i18next.t('view-contracts-advanced.status') },
            { key: 'reference', title: i18next.t('view-contracts-advanced.reference') },
            { key: 'ocrStatus', title: i18next.t('view-contracts-advanced.ocr-status'), isDisplaying: false },
            {
                key: 'document.ocr',
                title: i18next.t('view-contracts-advanced.ocr_results'),
                isDisplaying: false,
                spreadsheetFormat: 'json',
            },
        ];

        this.query.filterKeys = [
            {
                key: 'type',
                display: i18next.t('view-contracts-advanced.type'),
                type: FilterKeyType.Dropdown,
                options: Object.keys(ContractType).map((type) => `${type}Contract`),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'ocrStatus',
                display: i18next.t('view-contracts-advanced.ocr-status'),
                type: FilterKeyType.Dropdown,
                options: Object.keys(ContractOcrStatus),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'startDate',
                display: i18next.t('view-contracts-advanced.start_date'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'endDate',
                display: i18next.t('view-contracts-advanced.end_date'),
                type: FilterKeyType.Date,
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'vehicle.registration',
                display: i18next.t('view-contracts-advanced.vehicle_registration'),
                visibility: FilterKeyVisibility.Simple,
                columnKey: 'vehicle',
                enableSearch: true,
                searchEntity: 'vehicle',
                searchField: 'registration',
            },
            {
                key: 'owner.name',
                display: i18next.t('view-contracts-advanced.owner_name'),
                visibility: FilterKeyVisibility.Simple,
                columnKey: 'owner',
                enableSearch: true,
                searchEntity: 'account',
                searchField: 'name',
            },
            {
                key: 'user.name',
                display: i18next.t('view-contracts-advanced.user_name'),
                visibility: FilterKeyVisibility.Simple,
                columnKey: 'user',
                enableSearch: true,
                searchEntity: 'account',
                searchField: 'name',
            },
            {
                key: 'document',
                type: FilterKeyType.Existence,
                display: i18next.t('view-contracts-advanced.document'),
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'status',
                display: i18next.t('view-contracts-advanced.status'),
                type: FilterKeyType.Dropdown,
                options: [ContractStatus.Expired, ContractStatus.ExpiringSoon, ContractStatus.Valid, ContractStatus.Upcoming],
                visibility: FilterKeyVisibility.Simple,
            },
            { key: 'reference', display: i18next.t('view-contracts-advanced.reference') },
        ];
    }

    ngOnInit() {
        // this.getContracts();
        this.table.templateColumns = {
            startDate: this.startDate,
            endDate: this.endDate,
            owner: this.owner,
            user: this.user,
            vehicle: this.vehicle,
            status: this.status,
            currentForVehicle: this.current,
            document: this.document,
            ocrStatus: this.ocrStatus,
            'document.ocr': this.ocr,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }
        this.table.selectDataFromStore();

        this.store.pipe(select(contractNgrxHelper.selectCurrentlySelectedRowData(), takeUntil(this.destroy$))).subscribe((result) => {
            this.selectedContracts = result;
        });
    }

    ngAfterViewInit(): void {}

    onCreateLeaseContract() {
        this.createContractModal = this.modalService.create({
            nzTitle: i18next.t('view-contracts-advanced.create_lease_contract'),
            nzContent: CreateContractModalComponent,
            nzFooter: null,
            nzComponentParams: {
                type: ContractType.Lease,
                vehicleId: this.vehicleId || null,
            },
        });
    }

    onCreateOwnershipContract() {
        this.createContractModal = this.modalService.create({
            nzTitle: i18next.t('view-contracts-advanced.create_ownership_contract'),
            nzContent: CreateContractModalComponent,
            nzFooter: null,
            nzComponentParams: {
                type: ContractType.Ownership,
                vehicleId: this.vehicleId || null,
            },
        });
    }

    onCreateDriverContract() {
        this.createContractModal = this.modalService.create({
            nzTitle: i18next.t('view-contracts-advanced.create_driver_contract'),
            nzContent: CreateContractModalComponent,
            nzFooter: null,
            nzComponentParams: {
                type: ContractType.Driver,
                vehicleId: this.vehicleId || null,
            },
        });
    }

    onRunBulkOcr() {
        const contractIds = this.selectedContracts.map((a) => a.contractId);
        this.store.dispatch(bulkOcr({ contractIds }));
    }

    canRunBulkOcr(): boolean {
        const areOwnershipContracts = this.selectedContracts.some((contractObject) => {
            return contractObject.type === ContractType.Ownership;
        });
        const oneIsSelected = this.selectedContracts.length > 0;
        return !areOwnershipContracts && oneIsSelected;
    }

    onViewContract(contractId: number) {
        if (!contractId) {
            this.logger.warn('Tried to view an Contract without an contract id');
            return;
        }
        // this.router.navigate(['/home', 'contracts', 'view', contractId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'contracts', 'view', contractId]));
        window.open(url, '_blank');
    }

    onEditContract(contract: Contract) {
        this.editContractModal = this.modalService.create({
            nzTitle: i18next.t('view-contract.edit_contract'),
            nzContent: UpdateContractDatesComponent,
            nzFooter: null,
            nzComponentParams: { contract },
        });
        this.editContractModal.componentInstance.updated.subscribe(() => {
            this.editContractModal.close();
        });
    }

    canGenerateLeaseContractDocuments(): boolean {
        const areOwnershipContracts = this.selectedContracts.some((contractObject) => {
            return contractObject.type === ContractType.Ownership;
        });
        const oneIsSelected = this.selectedContracts.length > 0;
        return !areOwnershipContracts && oneIsSelected;
    }

    batchGenerateLeaseContractDocuments() {
        this.userDetailsModal = this.modalService.create({
            nzTitle: i18next.t('view-contracts-advanced.generate_lease_contract_documents'),
            nzContent: BulkCreateLeaseContractDocumentModalComponent,
            nzFooter: null,
            nzComponentParams: {
                selectedContracts: this.selectedContracts,
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
