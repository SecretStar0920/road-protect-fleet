import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '@modules/user/services/user.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { User } from '@modules/shared/models/entities/user.model';
import { select, Store } from '@ngrx/store';
import * as fromUser from '@modules/user/ngrx/user.reducer';
import { UserState } from '@modules/user/ngrx/user.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateUserModalComponent } from '@modules/user/components/create-user/create-user-modal/create-user-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-users',
    templateUrl: './view-users.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-users.component.less'],
})
export class ViewUsersComponent implements OnInit, OnDestroy {
    users: User[];
    getUsersState: ElementStateModel = new ElementStateModel();
    createUserModal: NzModalRef<any>;

    @Input() action: TemplateRef<any>;
    @Input() delete: TemplateRef<any>;

    @ViewChild('accountsTemplate', { static: true }) accountsTemplate: TemplateRef<any>;

    private destroy$ = new Subject();

    constructor(
        private userService: UserService,
        public table: GeneralTableService,
        private store: Store<UserState>,
        private modalService: NzModalService,
    ) {}

    ngOnInit() {
        this.table.options.primaryColumnKey = 'userId';
        this.table.options.enableRowSelect = false;
        this.table.options.export = {
            enabled: true,
            entity: 'User',
        };
        this.table.customColumns = [
            {
                title: i18next.t('create-user.email'),
                key: 'email',
            },
            {
                title: i18next.t('create-user.name'),
                key: 'name',
            },
            {
                title: i18next.t('create-user.surname'),
                key: 'surname',
            },
            {
                title: i18next.t('create-user.type'),
                key: 'type',
            },
            {
                title: i18next.t('view-users.accounts'),
                key: 'accounts',
            },
        ];
        this.table.templateColumns = {
            accounts: this.accountsTemplate,
        };
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }
        this.getUsers();
    }

    getUsers() {
        this.getUsersState.submit();
        this.userService.getAllUsers().subscribe(
            (result) => {
                this.getUsersState.onSuccess(i18next.t('view-users.success'), result);
            },
            (error) => {
                this.getUsersState.onFailure(i18next.t('view-users.fail'), error.error);
            },
        );
        this.store.pipe(select(fromUser.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.users = result;
            this.table.data = this.users.slice();
        });
    }

    onCreateUser() {
        this.createUserModal = this.modalService.create({
            nzTitle: i18next.t('view-users.create_user'),
            nzContent: CreateUserModalComponent,
            nzFooter: null,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
