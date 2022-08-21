import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AccountUserService } from '@modules/account-user/services/account-user.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { select, Store } from '@ngrx/store';
import * as accountUserSelectors from '@modules/account-user/ngrx/account-user.selectors';
import { getAccountUsersByAccountId } from '@modules/account-user/ngrx/account-user.selectors';
import { AccountUserState } from '@modules/account-user/ngrx/account-user.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateAccountUserModalComponent } from '@modules/account-user/components/create-account-user/create-account-user-modal/create-account-user-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { getSelectedAccountId } from '@modules/account/ngrx/account.selectors';
import { ViewAccountUserModalComponent } from '@modules/account-user/components/view-account-user/view-account-user-modal/view-account-user-modal.component';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-account-users',
    templateUrl: './view-account-users.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-account-users.component.less'],
})
export class ViewAccountUsersComponent implements OnInit, OnDestroy {
    private _accountId: number;

    accountUsers: AccountUser[];
    getAccountUsersState: ElementStateModel = new ElementStateModel();

    createAccountUserModal: NzModalRef<any>;
    viewAccountUserModal: NzModalRef<any>;

    private destroy$ = new Subject();

    @ViewChild('rolesTemplate', { static: true })
    rolesTemplate: TemplateRef<any>;

    @ViewChild('actions', { static: true })
    actions: TemplateRef<any>;

    @ViewChild('delete', { static: true })
    delete: TemplateRef<any>;

    permissions = PERMISSIONS;

    constructor(
        private accountUserService: AccountUserService,
        public table: GeneralTableService,
        private store: Store<AccountUserState>,
        private modalService: NzModalService,
    ) {
        this.table.options.primaryColumnKey = 'accountUserId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
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
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            roles: this.rolesTemplate,
        };
        if (this.actions) {
            this.table.columnActionTemplate = this.actions;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }

        this.store.pipe(select(getSelectedAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this._accountId = accountId;
            this.getAccountUsers();
        });
    }

    getAccountUsers() {
        this.getAccountUsersState.submit();
        if (this._accountId) {
            this.accountUserService.getAccountUsersForAccount(this._accountId).subscribe(
                (result) => {
                    this.getAccountUsersState.onSuccess(i18next.t('view-account-users.success'), result);
                },
                (error) => {
                    this.getAccountUsersState.onFailure(i18next.t('view-account-users.fail'), error.error);
                },
            );
            this.store.pipe(select(getAccountUsersByAccountId(this._accountId)), takeUntil(this.destroy$)).subscribe((result) => {
                this.accountUsers = result;
                this.table.data = this.accountUsers.slice();
            });
        } else {
            this.accountUserService.getAllAccountUsers().subscribe(
                (result) => {
                    this.getAccountUsersState.onSuccess(i18next.t('view-account-users.success'), result);
                },
                (error) => {
                    this.getAccountUsersState.onFailure(i18next.t('view-account-users.fail'), error.error);
                },
            );
            this.store.pipe(select(accountUserSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
                this.accountUsers = result;
                this.table.data = this.accountUsers.slice();
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onCreateAccountUser() {
        this.createAccountUserModal = this.modalService.create({
            nzTitle: i18next.t('view-account-users.add'),
            nzContent: CreateAccountUserModalComponent,
            nzFooter: null,
            nzComponentParams: { accountId: this._accountId },
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
}
