import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { accountUserNgrxHelper, AccountUserState } from '@modules/account-user/ngrx/account-user.reducer';
import { Subject } from 'rxjs';
import { CreateAccountUserModalComponent } from '@modules/account-user/components/create-account-user/create-account-user-modal/create-account-user-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { AccountUserQueryService } from '@modules/account-user/services/account-user-query.service';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { ViewAccountUserModalComponent } from '@modules/account-user/components/view-account-user/view-account-user-modal/view-account-user-modal.component';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { UpdateAccountUserComponent } from '@modules/account-user/components/update-account-user/update-account-user.component';

@Component({
    selector: 'rp-view-account-users-advanced',
    templateUrl: './view-account-users-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: AccountUserQueryService }],
    styleUrls: ['./view-account-users-advanced.component.less'],
})
export class ViewAccountUsersAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @ViewChild('rolesTemplate', { static: true }) rolesTemplate: TemplateRef<any>;

    permissions = PERMISSIONS;
    createAccountUserModal: NzModalRef<any>;
    viewAccountUserModal: NzModalRef<any>;
    editAccountUserModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    account: Account;

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<AccountUserState>,
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
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.accountUserTable }));
        // this.table.pageDataSelector = accountUserSelectors.selectAll;
        this.table.ngrxHelper = accountUserNgrxHelper;
        this.table.options.primaryColumnKey = 'accountUserId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'user.email',
                title: i18next.t('account-user.email'),
            },
            {
                key: 'user.name',
                title: i18next.t('account-user.name'),
            },
            {
                key: 'user.surname',
                title: i18next.t('account-user.surname'),
            },
            {
                key: 'roles',
                title: i18next.t('account-user.roles'),
            },
            // INSERT COLUMNS
        ];

        this.query.filterKeys = [
            { key: 'user.email', display: i18next.t('account-user.email'), visibility: FilterKeyVisibility.Simple },
            { key: 'user.name', display: i18next.t('account-user.name'), visibility: FilterKeyVisibility.Simple },
            { key: 'user.surname', display: i18next.t('account-user.surname'), visibility: FilterKeyVisibility.Simple },
            // Insert filters
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            roles: this.rolesTemplate,
            // systemStatus: this.systemStatus,
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

    onCreateAccountUser() {
        this.createAccountUserModal = this.modalService.create({
            nzTitle: i18next.t('view-account-users.add'),
            nzContent: CreateAccountUserModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onViewAccountUser(accountUserId: number) {
        this.viewAccountUserModal = this.modalService.create({
            nzTitle: i18next.t('view-account-users.view'),
            nzContent: ViewAccountUserModalComponent,
            nzFooter: null,
            nzComponentParams: { accountUserId },
        });
    }

    onEditAccountUser(accountUser: AccountUser) {
        this.editAccountUserModal = this.modalService.create({
            nzTitle: i18next.t('view-account-user-advanced.edit_account_user'),
            nzContent: UpdateAccountUserComponent,
            nzFooter: null,
            nzWidth: 900,
            nzComponentParams: { accountUser },
        });
        this.editAccountUserModal.componentInstance.complete.subscribe((result) => {
            this.editAccountUserModal.close();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
