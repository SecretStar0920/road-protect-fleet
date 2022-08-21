import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { roleNgrxHelper, RoleState } from '@modules/role/ngrx/role.reducer';
import { select, Store } from '@ngrx/store';
import { Role } from '@modules/shared/models/entities/role.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { RoleService } from '@modules/role/services/role.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-view-role',
    templateUrl: './view-role.component.html',
    styleUrls: ['./view-role.component.less'],
})
export class ViewRoleComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() roleId: number;
    role: Role;

    updateRoleState: ElementStateModel<Role> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Role>> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(private store: Store<RoleState>, private logger: NGXLogger, private roleService: RoleService) {}

    ngOnInit() {
        this.getRole();
    }

    getRole() {
        this.store
            .pipe(
                select(roleNgrxHelper.selectEntityById(this.roleId)),
                takeUntil(this.destroy$),
                tap((role) => {
                    if (!role) {
                        this.logger.debug('Role not found on store, querying for it');
                        this.roleService.getRole(this.roleId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.role = result;
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Role>) {
        this.onUpdate();
        this.updateRoleState = state;
    }

    onDelete(deleteState: ElementStateModel<Role>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
