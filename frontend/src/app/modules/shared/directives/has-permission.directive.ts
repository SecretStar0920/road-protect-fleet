import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthState, currentPermissions, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { select, Store } from '@ngrx/store';
import { some, isNil } from 'lodash';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RoleService } from '@modules/role/services/role.service';
import { RolePermission } from '@modules/shared/models/entities/role-permission.model';
import { User, UserType } from '@modules/shared/models/entities/user.model';

@Directive({
    selector: '[rpHasPermission]',
})
export class HasPermissionDirective implements OnDestroy {
    private requiredPermissions: { name: string; group: string }[];

    private rolePermissions: RolePermission[];
    private user: User;
    private alternateTemplate: TemplateRef<any>;

    private hasView: boolean = false;

    $destroy = new Subject();

    @Input()
    set rpHasPermission(value: { name: string; group: string }[]) {
        this.requiredPermissions = value;
        this.updateView();
    }

    // The else value that the directive takes
    @Input()
    set rpHasPermissionElse(value) {
        this.alternateTemplate = value;
        this.updateView();
    }

    constructor(
        private readonly viewContainer: ViewContainerRef,
        private readonly intendedTemplate: TemplateRef<any>,
        private store: Store<AuthState>,
        private roleService: RoleService,
    ) {
        this.clearView();
        this.store
            .pipe(select(currentPermissions))
            .pipe(
                tap((accountUser) => {
                    if (isNil(accountUser)) {
                        return this.roleService.getCurrentPermissions().subscribe();
                    }
                }),
                takeUntil(this.$destroy),
            )
            .subscribe((rolePermissions) => {
                this.rolePermissions = rolePermissions;
                this.updateView();
            });

        this.store
            .pipe(select(currentUser))
            .pipe(takeUntil(this.$destroy))
            .subscribe((user) => {
                this.user = user;
                this.updateView();
            });
    }

    private updateView() {
        let hasPermission = false;

        if (this.rolePermissions.length > 0) {
            hasPermission = some(this.requiredPermissions, (requiredPermission) => {
                return some(this.rolePermissions, (permission: RolePermission) => {
                    return permission.permission.name === requiredPermission.name;
                });
            });
        }

        if (!isNil(this.user)) {
            if (this.user.type === UserType.Developer || this.user.type === UserType.Admin) {
                hasPermission = true;
            }
        }

        if (hasPermission === true && this.hasView === false) {
            this.renderIntended();
        } else if (hasPermission === false && this.hasView === true) {
            this.clearView();
        }

        if (hasPermission === false && this.hasView === false && !isNil(this.alternateTemplate)) {
            this.renderAlternate();
        }
    }

    private renderIntended() {
        this.viewContainer.createEmbeddedView(this.intendedTemplate);
        this.hasView = true;
    }

    private renderAlternate() {
        this.viewContainer.createEmbeddedView(this.alternateTemplate);
        this.hasView = true;
    }

    private clearView() {
        this.viewContainer.clear();
        this.hasView = false;
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }
}
