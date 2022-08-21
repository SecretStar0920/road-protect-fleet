import { Component, OnDestroy, OnInit } from '@angular/core';
import { currentPermissions, currentRole } from '@modules/auth/ngrx/auth.reducer';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { groupBy, isNil } from 'lodash';
import { of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { RoleService } from '@modules/role/services/role.service';
import { Permission } from '@modules/shared/models/entities/permission.model';
import { colors } from '@modules/shared/constants/colors';

@Component({
    selector: 'rp-view-current-account-user-permissions',
    templateUrl: './view-current-account-user-permissions.component.html',
    styleUrls: ['./view-current-account-user-permissions.component.less'],
})
export class ViewCurrentAccountUserPermissionsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();

    permissions: Permission[] = [];
    groupedPermissions: { [group: string]: Permission[] };
    antColors = colors;

    constructor(private store: Store<AppState>, private roleService: RoleService) {}

    ngOnInit() {
        this.store
            .select(currentPermissions)
            .pipe(
                switchMap((rolePermissions) => {
                    if (rolePermissions.length === 0) {
                        return this.roleService.getCurrentPermissions();
                    } else {
                        return of(rolePermissions);
                    }
                }),
                map((rolePermissions) => {
                    return rolePermissions.map((rolePermission) => rolePermission.permission);
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((permissions) => {
                this.permissions = permissions;
                this.groupedPermissions = groupBy(permissions, 'group');
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
