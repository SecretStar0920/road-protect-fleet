import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { AuthState, currentPermissions, currentRole, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { select, Store } from '@ngrx/store';

import { isNil, some } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoleService } from '@modules/role/services/role.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserType } from '@modules/shared/models/entities/user.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';
import i18next from 'i18next';

@Injectable({
    providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild {
    constructor(
        private store: Store<AuthState>,
        private modalService: NzModalService,
        private roleService: RoleService,
        private authService: AuthService,
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const requiredPermissions = next.data.permissions || [];

        const currentUser$ = this.store.pipe(select(currentUser)).pipe(
            switchMap((user) => {
                if (isNil(user)) {
                    return this.authService.getMe();
                } else {
                    return of(user);
                }
            }),
        );

        const currentPermissions$ = this.store.select(currentPermissions).pipe(
            switchMap((permissions) => {
                if (permissions.length < 0) {
                    return this.roleService.getCurrentPermissions();
                } else {
                    return of(permissions);
                }
            }),
        );

        // const fork = forkJoin(currentRole$, currentUser$);
        // const zipTest = zip(currentRole$, currentUser$);
        // const latestFrom = currentRole$.pipe(withLatestFrom(currentUser$));

        const check = zip(currentPermissions$, currentUser$).pipe(
            map(([permissions, user]) => {
                // Check user type
                const isAdmin = user.type === UserType.Admin || user.type === UserType.Developer;

                if (isAdmin) {
                    return isAdmin;
                }

                if (permissions.length < 1 || isNil(user)) {
                    return false;
                }

                // Check permissions
                const hasPermission = some(requiredPermissions, (requiredPermission) => {
                    return some(permissions, (rolePermission) => rolePermission.permission.name === requiredPermission.name);
                });

                return hasPermission;
            }),
            tap((result) => {
                if (result === false) {
                    this.modalService.confirm(
                        {
                            nzTitle: i18next.t('permission-guard.title'),
                            nzContent: `${i18next.t('permission-guard.content_1')} ${requiredPermissions
                                .map((o) => o.name)
                                .join(', ')}. ${i18next.t('permission-guard.content_2')}`,
                            nzCancelText: null,
                        },
                        'warning',
                    );
                }
            }),
        );
        return check;
    }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(next, state);
    }
}
