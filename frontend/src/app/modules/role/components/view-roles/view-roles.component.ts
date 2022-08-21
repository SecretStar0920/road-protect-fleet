import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { RoleService } from '@modules/role/services/role.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { Role } from '@modules/shared/models/entities/role.model';
import { select, Store } from '@ngrx/store';
import * as roleSelectors from '@modules/role/ngrx/role.selectors';
import { RoleState } from '@modules/role/ngrx/role.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-roles',
    templateUrl: './view-roles.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-roles.component.less'],
})
export class ViewRolesComponent implements OnInit, OnDestroy {
    roles: Role[];
    getRolesState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(private roleService: RoleService, public table: GeneralTableService, private store: Store<RoleState>) {
        this.table.options.primaryColumnKey = 'roleId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
            {
                key: 'roleId',
                title: 'id',
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getRoles();
    }

    getRoles() {
        this.getRolesState.submit();
        this.roleService.getAllRoles().subscribe(
            (result) => {
                this.getRolesState.onSuccess(i18next.t('view-roles.success'), result);
            },
            (error) => {
                this.getRolesState.onFailure(i18next.t('view-roles.fail'), error.error);
            },
        );
        this.store.pipe(select(roleSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.roles = result;
            this.table.data = this.roles.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
