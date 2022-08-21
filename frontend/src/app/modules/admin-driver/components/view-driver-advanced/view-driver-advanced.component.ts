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
import { driverNgrxHelper, DriverState } from '@modules/admin-driver/ngrx/driver.reducer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DriverQueryService } from '@modules/admin-driver/services/driver-query.service';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateDriverComponent } from '@modules/admin-driver/components/update-driver/update-driver-component';
import { Driver } from '@modules/shared/models/entities/driver.model';

@Component({
    selector: 'rp-view-driver-advanced',
    templateUrl: './view-driver-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: DriverQueryService }],
    styleUrls: ['./view-driver-advanced.component.less'],
})
export class ViewDriverAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('physicalLocation', { static: true }) physicalLocation: TemplateRef<any>;
    @ViewChild('postalLocation', { static: true }) postalLocation: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @ViewChild('action', { static: true }) action: TemplateRef<any>;

    editDriverModal: NzModalRef<any>;

    private destroy$ = new Subject();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<DriverState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.driverTable }));
        this.table.ngrxHelper = driverNgrxHelper;
        this.table.options.primaryColumnKey = 'driverId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'name',
                title: i18next.t('driver.name'),
            },
            {
                key: 'surname',
                title: i18next.t('driver.surname'),
            },
            {
                key: 'idNumber',
                title: i18next.t('driver.id_number'),
            },
            {
                key: 'licenseNumber',
                title: i18next.t('driver.license'),
            },
            {
                key: 'email',
                title: i18next.t('driver.email'),
            },
            {
                key: 'cellphoneNumber',
                title: i18next.t('driver.cellphoneNumber'),
            },
            { key: 'physicalLocation.address', title: i18next.t('driver.location') },
            { key: 'postalLocation.address', title: i18next.t('driver.postal_location') },
        ];
        this.query.filterKeys = [
            {
                key: 'idNumber',
                display: i18next.t('driver.id_number'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'driver',
                searchField: 'idNumber',
            },
            {
                key: 'licenseNumber',
                display: i18next.t('driver.license'),
                type: FilterKeyType.ExactString,
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'driver',
                searchField: 'licenseNumber',
            },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            'postalLocation.address': this.postalLocation,
            'physicalLocation.address': this.physicalLocation,
        };
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewDriver(driverId: number) {
        if (!driverId) {
            this.logger.warn('Tried to view a driver without an driverId');
            return;
        }
        // this.router.navigate(['/home', 'driver', 'view', driverId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'driver', 'view', driverId]));
        window.open(url, '_blank');
    }

    onEditDriver(driver: Driver) {
        this.editDriverModal = this.modalService.create({
            nzTitle: i18next.t('driver.edit-driver'),
            nzContent: UpdateDriverComponent,
            nzFooter: null,
            nzWidth: 900,
            nzComponentParams: { driver: driver },
        });

        this.editDriverModal.componentInstance.complete.subscribe((result) => {
            this.editDriverModal.close();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
