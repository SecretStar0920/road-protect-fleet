import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Nomination, NominationStatus, NominationType } from '@modules/shared/models/entities/nomination.model';
import { Store } from '@ngrx/store';
import { NominationState } from '@modules/nomination/ngrx/nomination.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { NominationQueryService } from '@modules/nomination/services/nomination-query.service';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { FilterKeyType } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-nominations-advanced',
    templateUrl: './view-nominations-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: NominationQueryService }],
    styleUrls: ['./view-nominations-advanced.component.less'],
})
export class ViewNominationsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    nominations: Nomination[];
    getNominationsState: ElementStateModel = new ElementStateModel();
    @ViewChild('offenceDate', { static: true }) offenceDate: TemplateRef<any>;
    @ViewChild('latestPaymentDate', { static: true }) latestPaymentDate: TemplateRef<any>;
    @ViewChild('amountDue', { static: true }) amountDue: TemplateRef<any>;
    @ViewChild('vehicle', { static: true }) vehicle: TemplateRef<any>;
    @ViewChild('vehicleOwner', { static: true }) vehicleOwner: TemplateRef<any>;
    @ViewChild('vehicleUser', { static: true }) vehicleUser: TemplateRef<any>;
    @ViewChild('issuer', { static: true }) issuer: TemplateRef<any>;
    @ViewChild('status', { static: true }) status: TemplateRef<any>;
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('location', { static: true }) location: TemplateRef<any>;
    @ViewChild('nominationAccount', { static: true }) nominationAccount: TemplateRef<any>;
    @ViewChild('nominationStatus', { static: true }) nominationStatus: TemplateRef<any>;
    @ViewChild('paidDate', { static: true }) paidDate: TemplateRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    permissions = PERMISSIONS;

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private nominationService: NominationService,
        private store: Store<NominationState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        // this.table.pageDataSelector = nominationSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.nominationsTable }));
        this.table.options.primaryColumnKey = 'nominationId';
        this.table.options.enableRowSelect = true;
        this.table.defaultColumns = [
            { key: 'infringement.noticeNumber', title: i18next.t('view-nominations-advanced.notice_number') },
            { key: 'infringement.status', title: i18next.t('view-nominations-advanced.infringement_status') },
            { key: 'infringement.issuerStatus', title: i18next.t('view-nominations-advanced.issuer_status'), isDisplaying: false },
            { key: 'status', title: i18next.t('view-nominations-advanced.status') },
            { key: 'type', title: i18next.t('view-nominations-advanced.type') },
            { key: 'infringement.amountDue', title: i18next.t('view-nominations-advanced.amount_due') },
            { key: 'infringement.vehicle.registration', title: i18next.t('view-nominations-advanced.vehicle_registration') },
            { key: 'account', title: i18next.t('view-nominations-advanced.account') },
            { key: 'infringement.contract.owner.name', title: i18next.t('view-nominations-advanced.vehicle_owner') },
            { key: 'infringement.contract.user.name', title: i18next.t('view-nominations-advanced.vehicle_user') },
            { key: 'infringement.location', title: i18next.t('view-nominations-advanced.location') },
            { key: 'infringement.reason', title: i18next.t('view-nominations-advanced.reason') },
            { key: 'infringement.reasonCode', title: i18next.t('view-nominations-advanced.reason_code'), isDisplaying: false },
            { key: 'infringement.issuer.name', title: i18next.t('view-nominations-advanced.issuer_name') },
            { key: 'infringement.offenceDate', title: i18next.t('view-nominations-advanced.offence_date'), isDisplaying: false },
            {
                key: 'infringement.latestPaymentDate',
                title: i18next.t('view-nominations-advanced.latest_payment_date'),
                isDisplaying: false,
            },
            { key: 'paidDate', title: i18next.t('view-nominations-advanced.paid_date'), isDisplaying: false },
            { key: 'infringement.createdAt', title: i18next.t('view-infringement-advanced.date_uploaded'), isDisplaying: false },
        ];

        this.query.filterKeys = [
            { key: 'infringement.noticeNumber', display: i18next.t('view-nominations-advanced.notice_number') },
            {
                key: 'infringement.status',
                type: FilterKeyType.Dropdown,
                options: Object.values(InfringementStatus),
                display: i18next.t('view-nominations-advanced.infringement_status'),
            },
            {
                key: 'status',
                type: FilterKeyType.Dropdown,
                options: Object.values(NominationStatus),
                display: i18next.t('view-nominations-advanced.status'),
            },
            {
                key: 'type',
                type: FilterKeyType.Dropdown,
                options: Object.values(NominationType),
                display: i18next.t('view-nominations-advanced.type'),
            },
            { key: 'infringement.amountDue', type: FilterKeyType.Number, display: i18next.t('view-nominations-advanced.amount_due') },
            { key: 'vehicle.registration', display: i18next.t('view-nominations-advanced.vehicle_registration') },
            { key: 'account.name', display: i18next.t('view-nominations-advanced.account') },
            { key: 'contract_owner.name', display: i18next.t('view-nominations-advanced.vehicle_owner') },
            { key: 'contract_user.name', display: i18next.t('view-nominations-advanced.vehicle_user') },
            { key: 'location.formattedAddress', display: i18next.t('view-nominations-advanced.location') },
            { key: 'infringement.reason', display: i18next.t('view-nominations-advanced.reason') },
            { key: 'infringement.reasonCode', display: i18next.t('view-nominations-advanced.reason_code') },
            {
                key: 'issuer.name',
                display: i18next.t('view-nominations-advanced.issuer_name'),
                enableSearch: true,
                searchEntity: 'issuer',
                searchField: 'name',
            },
            { key: 'infringement.offenceDate', type: FilterKeyType.Date, display: i18next.t('view-nominations-advanced.offence_date') },
            {
                key: 'infringement.latestPaymentDate',
                type: FilterKeyType.Date,
                display: i18next.t('view-nominations-advanced.latest_payment_date'),
            },
            { key: 'paidDate', type: FilterKeyType.Date, display: i18next.t('view-nominations-advanced.paid_date') },
            { key: 'infringement.createdAt', type: FilterKeyType.Date, display: i18next.t('view-infringement-advanced.date_uploaded') },
        ];
    }

    ngOnInit() {
        // this.getNominations();
        this.table.templateColumns = {
            'infringement.offenceDate': this.offenceDate,
            'infringement.latestPaymentDate': this.latestPaymentDate,
            'infringement.issuer.name': this.issuer,
            'infringement.vehicle.registration': this.vehicle,
            'infringement.contract.owner.name': this.vehicleOwner,
            'infringement.contract.user.name': this.vehicleUser,
            status: this.nominationStatus,
            account: this.nominationAccount,
            paidDate: this.paidDate,
            'infringement.amountDue': this.amountDue,
            'infringement.status': this.status,
            'infringement.location': this.location,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onViewNomination(infringementId: number) {
        if (!infringementId) {
            this.logger.warn('Tried to view a nomination without an nomination id');
            return;
        }
        // this.router.navigate(['/home', 'infringements', 'view', infringementId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'infringements', 'view', infringementId]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.table.clearRowSelections();
        this.destroy$.next();
    }

    onViewSelectOnMap() {
        // const modal = this.modalService.create({
        //     nzTitle: i18next.t('view-nominations-advanced.view_map'),
        //     nzContent: ViewLocationsComponent,
        //     nzComponentParams: {
        //         locations: this.selectedRows.map((o) => o.infringement.location),
        //     },
        // });
    }
}
