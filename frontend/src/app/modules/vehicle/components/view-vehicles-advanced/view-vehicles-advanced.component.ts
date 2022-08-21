import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { vehicleNgrxHelper, VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { Subject } from 'rxjs';
import { CreateVehicleModalComponent } from '@modules/vehicle/components/create-vehicle/create-vehicle-modal/create-vehicle-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { VehicleQueryService } from '@modules/vehicle/services/vehicle-query.service';
import { ContractStatus } from '@modules/shared/models/entities/contract.model';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { Vehicle, VehicleType } from '@modules/shared/models/entities/vehicle.model';
import { take, takeUntil } from 'rxjs/operators';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateVehicleComponent } from '@modules/vehicle/components/update-vehicle/update-vehicle.component';

@Component({
    selector: 'rp-view-vehicles-advanced',
    templateUrl: './view-vehicles-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: VehicleQueryService }],
    styleUrls: ['./view-vehicles-advanced.component.less'],
})
export class ViewVehiclesAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    // Templates
    @ViewChild('userTemplate', { static: true }) userTemplate: TemplateRef<any>;
    @ViewChild('ownerTemplate', { static: true }) ownerTemplate: TemplateRef<any>;
    @ViewChild('leaseContractStatus', { static: true }) leaseContractStatus: TemplateRef<any>;
    @ViewChild('ownershipContractStatus', { static: true }) ownershipContractStatus: TemplateRef<any>;
    @ViewChild('infringementsTemplate', { static: true }) infringementsTemplate: TemplateRef<any>;
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @Input() filterVisibility: FilterKeyVisibility = FilterKeyVisibility.Simple;

    createVehicleModal: NzModalRef<any>;
    editVehicleModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    leaseStatus = ContractStatus;
    tableName: AdvancedTableNameEnum;

    permissions = PERMISSIONS;

    private userId: number;
    private ownerId: number;

    private _accountId: number;
    get accountId(): number {
        return this._accountId;
    }

    @Input()
    set accountId(value: number) {
        this._accountId = value;
        if (value) {
            this.updateSelector();
        }
    }

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<VehicleState>,
        private modalService: NzModalService,
        private activatedRoute: ActivatedRoute,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
        this.store.pipe(select(vehicleNgrxHelper.selectQueryParams()), takeUntil(this.destroy$)).subscribe((result) => {
            this.query.refreshData();
        });
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.vehicleTable }));
        this.table.options.primaryColumnKey = 'vehicleId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            { key: 'registration', title: i18next.t('create-vehicle.registration') },
            { key: 'manufacturer', title: i18next.t('create-vehicle.manufacturer') },
            { key: 'model', title: i18next.t('create-vehicle.model') },
            { key: 'modelYear', title: i18next.t('create-vehicle.year') },
            { key: 'color', title: i18next.t('create-vehicle.color') },
            { key: 'category', title: i18next.t('create-vehicle.category') },
            { key: 'weight', title: i18next.t('create-vehicle.weight') },
            { key: 'type', title: i18next.t('create-vehicle.type') },
            // { title: 'Lease User', key: 'currentLeaseContract.user.name' },
            // { title: 'Owner', key: 'currentLeaseContract.owner.name' },
            { title: i18next.t('create-vehicle.current_lease'), key: 'currentLeaseContract.status' },
            { title: i18next.t('create-vehicle.current_ownership'), key: 'currentOwnershipContract.status' },
            // { title: 'Current Contract Type', key: 'currentLeaseContract.type' },
            { title: i18next.t('create-vehicle.infringements'), key: 'infringements.length' },
        ];

        this.query.filterKeys = [
            { key: 'registration', display: i18next.t('create-vehicle.registration'), visibility: FilterKeyVisibility.Simple },
            { key: 'manufacturer', display: i18next.t('create-vehicle.manufacturer'), visibility: FilterKeyVisibility.Simple },
            { key: 'model', display: i18next.t('create-vehicle.model') },
            { key: 'modelYear', display: i18next.t('create-vehicle.year'), type: FilterKeyType.Number },
            { key: 'color', display: i18next.t('create-vehicle.color') },
            { key: 'category', display: i18next.t('create-vehicle.category') },
            { key: 'weight', type: FilterKeyType.Number, display: i18next.t('create-vehicle.weight') },
            {
                key: 'type',
                type: FilterKeyType.Dropdown,
                options: Object.values(VehicleType as any),
                display: i18next.t('create-vehicle.type'),
                visibility: FilterKeyVisibility.Detailed,
            },
            {
                key: 'currentLeaseContract.status',
                display: i18next.t('create-vehicle.current_lease'),
                type: FilterKeyType.Dropdown,
                options: [ContractStatus.Expired, ContractStatus.ExpiringSoon, ContractStatus.Valid],
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'currentOwnershipContract.status',
                display: i18next.t('create-vehicle.current_ownership'),
                type: FilterKeyType.Dropdown,
                options: [ContractStatus.Expired, ContractStatus.ExpiringSoon, ContractStatus.Valid],
                visibility: FilterKeyVisibility.Simple,
            },
            {
                key: 'infringement.status',
                display: i18next.t('create-vehicle.infringements_status'),
                type: FilterKeyType.Dropdown,
                options: Object.values(InfringementStatus),
                visibility: FilterKeyVisibility.Simple,
            },
        ];
    }

    ngOnInit() {
        this.updateSelector();
        // this.table.pageDataSelector = vehicleSelectors.selectAll;
        this.table.ngrxHelper = vehicleNgrxHelper;
        this.table.templateColumns = {
            'currentLeaseContract.status': this.leaseContractStatus,
            'currentOwnershipContract.status': this.ownershipContractStatus,
            'infringements.length': this.infringementsTemplate,
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

    onCreateVehicle() {
        this.updateSelector();
        const params: any = {};
        if (this.userId) {
            params.accountId = this.userId;
        }
        if (this.ownerId) {
            params.ownerId = this.ownerId;
        }

        this.createVehicleModal = this.modalService.create({
            nzTitle: i18next.t('view-vehicles-advanced.create_vehicle'),
            nzContent: CreateVehicleModalComponent,
            nzFooter: null,
            nzComponentParams: params,
        });
    }

    onViewVehicle(vehicleId: number) {
        if (!vehicleId) {
            this.logger.warn('Tried to view an Vehicle without an vehicle id');
            return;
        }
        // this.router.navigate(['/home', 'vehicles', 'view', vehicleId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'vehicles', 'view', vehicleId]));
        window.open(url, '_blank');
    }

    onEditVehicle(vehicle: Vehicle) {
        this.editVehicleModal = this.modalService.create({
            nzTitle: i18next.t('view-vehicle-advanced.edit_vehicle'),
            nzContent: UpdateVehicleComponent,
            nzFooter: null,
            nzWidth: 900,
            nzComponentParams: { vehicle },
        });
        this.editVehicleModal.componentInstance.complete.subscribe((result) => {
            this.editVehicleModal.close();
        });
    }

    ngOnDestroy(): void {
        // this.store.dispatch(resetVehicleQueryParams());
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    private updateSelector() {
        this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
            if (params.tab === 'fleet') {
                this.userId = this.accountId;
            } else if (params.tab === 'owned') {
                this.ownerId = this.accountId;
            } else if (params.tab === 'all') {
                // Assuming the query parameters of mine have been set in the accounts page
            } else {
                this.store.dispatch(
                    vehicleNgrxHelper.setQueryParams({
                        query: {
                            mine: false,
                            via: 'all',
                        },
                    }),
                );
            }
        });
    }
}
