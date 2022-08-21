import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserType } from '@modules/shared/models/entities/user.model';
import { select, Store } from '@ngrx/store';
import { userNgrxHelper, UserState } from '@modules/user/ngrx/user.reducer';
import { Subject } from 'rxjs';
import { CreateUserModalComponent } from '@modules/user/components/create-user/create-user-modal/create-user-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { UserQueryService } from '@modules/user/services/user-query.service';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { UpdateUserModalComponent } from '@modules/user/components/update-user-modal/update-user-modal.component';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-users-advanced',
    templateUrl: './view-users-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: UserQueryService }],
    styleUrls: ['./view-users-advanced.component.less'],
})
export class ViewUsersAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    @ViewChild('accountsTemplate', { static: true }) accountsTemplate: TemplateRef<any>;

    createUserModal: NzModalRef<any>;
    editUserModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    account: Account;

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<UserState>,
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
        // this.table.pageDataSelector = userSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.userTable }));
        this.table.ngrxHelper = userNgrxHelper;
        this.table.options.primaryColumnKey = 'userId';
        this.table.options.enableRowSelect = false;
        this.table.defaultColumns = [
            {
                key: 'email',
                title: i18next.t('user.email'),
            },
            {
                key: 'name',
                title: i18next.t('user.name'),
            },
            {
                key: 'surname',
                title: i18next.t('user.surname'),
            },
            {
                key: 'type',
                title: i18next.t('user.type'),
            },
            {
                key: 'accounts',
                title: i18next.t('user.accounts'),
            },
            // INSERT COLUMNS
        ];

        this.query.filterKeys = [
            {
                key: 'email',
                display: i18next.t('user.email'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'user',
                searchField: 'email',
            },
            {
                key: 'name',
                display: i18next.t('user.name'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'user',
                searchField: 'name',
            },
            {
                key: 'surname',
                display: i18next.t('user.surname'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'user',
                searchField: 'surname',
            },
            {
                key: 'type',
                type: FilterKeyType.Dropdown,
                options: Object.values(UserType),
                display: i18next.t('user.type'),
                sortable: false,
                // display: i18next.t('user.type'),
                visibility: FilterKeyVisibility.Simple,
                // type: FilterKeyType.Dropdown,
                enableSearch: true,
                // searchEntity: 'user',
                // searchField: 'type',
            },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            accounts: this.accountsTemplate,
            // name: this.name,
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

    onCreateUser() {
        this.createUserModal = this.modalService.create({
            nzTitle: i18next.t('view-user-advanced.create_user'),
            nzContent: CreateUserModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onViewUser(userId: number) {
        if (!userId) {
            this.logger.warn('Tried to view an User without an user id');
            return;
        }
        // this.router.navigate(['/home', 'users', 'view', userId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'users', 'view', userId]));
        window.open(url, '_blank');
    }

    onEditUser(userId: number) {
        if (!userId) {
            this.logger.warn('Tried to view an User without an user id');
            return;
        }
        this.editUserModal = this.modalService.create({
            nzTitle: i18next.t('view-user-advanced.edit_user'),
            nzContent: UpdateUserModalComponent,
            nzFooter: null,
            nzComponentParams: { userId },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
