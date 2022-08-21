import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Account, AccountRole } from '@modules/shared/models/entities/account.model';
import { Store } from '@ngrx/store';
import * as accountSelectors from '@modules/account/ngrx/account.selectors';
import { accountNgrxHelper, AccountState } from '@modules/account/ngrx/account.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { AccountQueryService } from '@modules/account/services/account-query.service';
import { CreateAccountModalComponent } from '@modules/account/components/create-account/create-account-modal/create-account-modal.component';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { EmailAccountInfringementReportComponent } from '@modules/account/components/email-account-infringement-report/email-account-infringement-report.component';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateAccountComponent } from '@modules/account/components/update-account/update-account.component';

@Component({
    selector: 'rp-view-accounts-advanced',
    templateUrl: './view-accounts-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: AccountQueryService }],
    styleUrls: ['./view-accounts-advanced.component.less'],
})
export class ViewAccountsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    accounts: Account[];
    getAccountsState: ElementStateModel = new ElementStateModel();
    @ViewChild('isVerified', { static: true }) isVerifiedTemplate: TemplateRef<any>;
    @ViewChild('accountRole', { static: true }) accountRole: TemplateRef<any>;
    @ViewChild('active', { static: true }) active: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @ViewChild('powerOfAttorney', { static: true }) powerOfAttorney: TemplateRef<any>;
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('physicalLocation', { static: true }) physicalLocation: TemplateRef<any>;
    @ViewChild('postalLocation', { static: true }) postalLocation: TemplateRef<any>;

    createAccountModal: NzModalRef<any>;
    editAccountModal: NzModalRef<any>;
    sendAccountInfringementReportModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<AccountState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        // this.table.pageDataSelector = accountSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.accountsTable }));
        this.table.ngrxHelper = accountNgrxHelper;
        this.table.options.primaryColumnKey = 'accountId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            { key: 'identifier', title: i18next.t('account.id') },
            { key: 'name', title: i18next.t('account.name') },
            { key: 'primaryContact', title: i18next.t('account.primary_contact') },
            { key: 'details.name', title: i18next.t('account.contact_name') },
            { key: 'details.telephone', title: i18next.t('account.contact_telephone') },
            { key: 'isVerified', title: i18next.t('account.verified') + '?' },
            { key: 'role', title: i18next.t('account.primary_role') },
            { key: 'physicalLocation.address', title: i18next.t('account.location') },
            { key: 'postalLocation.address', title: i18next.t('account.postal_location') },
            { key: 'active', title: i18next.t('account.active') + '?' },
            { key: 'managed', title: i18next.t('account.managed') + '?' },
            { key: 'powerOfAttorney', title: i18next.t('account.pa') },
        ];

        this.query.filterKeys = [
            {
                key: 'identifier',
                display: i18next.t('account.id'),
                visibility: FilterKeyVisibility.Simple,
                searchEntity: 'account',
                searchField: 'identifier',
                enableSearch: true,
            },
            {
                key: 'name',
                display: i18next.t('account.name'),
                visibility: FilterKeyVisibility.Simple,
                searchEntity: 'account',
                searchField: 'name',
                enableSearch: true,
            },
            { key: 'primaryContact', display: i18next.t('account.primary_contact'), visibility: FilterKeyVisibility.Simple },
            { key: 'isVerified', type: FilterKeyType.Boolean, display: i18next.t('account.verified') },
            {
                key: 'role',
                type: FilterKeyType.Dropdown,
                options: Object.values(AccountRole),
                display: i18next.t('account.primary_role'),
                visibility: FilterKeyVisibility.Simple,
            },
            { key: 'active', type: FilterKeyType.Boolean, display: i18next.t('account.active') },
            { key: 'managed', type: FilterKeyType.Boolean, display: i18next.t('account.managed') },
            { key: 'powerOfAttorney', type: FilterKeyType.Existence, display: i18next.t('account.pa') },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            isVerified: this.isVerifiedTemplate,
            role: this.accountRole,
            active: this.active,
            powerOfAttorney: this.powerOfAttorney,
            'postalLocation.address': this.postalLocation,
            'physicalLocation.address': this.physicalLocation,
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

    onCreateAccount() {
        this.createAccountModal = this.modalService.create({
            nzTitle: i18next.t('view-accounts-advanced.create_account'),
            nzContent: CreateAccountModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onViewAccount(accountId: number) {
        if (!accountId) {
            this.logger.warn('Tried to view an Account without an account id');
            return;
        }
        // this.router.navigate(['/home', 'accounts', 'view', accountId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'accounts', 'view', accountId]));
        window.open(url, '_blank');
    }

    onEditAccount(account: Account) {
        this.editAccountModal = this.modalService.create({
            nzTitle: i18next.t('view-accounts-advanced.edit_account'),
            nzContent: UpdateAccountComponent,
            nzFooter: null,
            nzWidth: 900,
            nzComponentParams: { account },
        });
        this.editAccountModal.componentInstance.complete.subscribe((result) => {
            this.editAccountModal.close();
        });
    }

    onEmailAccount(account: Account) {
        this.sendAccountInfringementReportModal = this.modalService.create({
            nzContent: EmailAccountInfringementReportComponent,
            nzFooter: null,
            nzComponentParams: { account },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
