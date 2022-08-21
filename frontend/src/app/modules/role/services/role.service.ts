import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Role } from '@modules/shared/models/entities/role.model';
import { EMPTY, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { roleNgrxHelper, RoleState } from '@modules/role/ngrx/role.reducer';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto } from '@modules/role/services/create-role.dto';
import { UpdateRoleDto } from '@modules/role/services/update-role.dto';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { updateCurrentPermissions, updateCurrentRoleAction } from '@modules/auth/ngrx/auth.actions';
import { RolePermission } from '@modules/shared/models/entities/role-permission.model';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private getCurrentRoleState: ElementStateModel = new ElementStateModel();
    private getCurrentPermissionsRequest$: Observable<any>;

    constructor(private http: HttpService, private store: Store<RoleState>) {}

    getAllRoles() {
        return this.http.getSecure('role').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Role, item));
                }
                return [];
            }),
            tap((roles) => {
                this.store.dispatch(roleNgrxHelper.load({ items: roles }));
            }),
        );
    }

    getRole(roleId: number) {
        return this.http.getSecure(`role/${roleId}`).pipe(
            map((response: object) => {
                return plainToClass(Role, response);
            }),
            tap((role) => {
                this.store.dispatch(roleNgrxHelper.upsertOne({ item: role }));
            }),
        );
    }

    getCurrentRole() {
        if (this.getCurrentRoleState.isLoading()) {
            return EMPTY;
        }
        this.getCurrentRoleState.submit();
        return this.http.getSecure(`role/me`).pipe(
            map((response: object) => {
                return plainToClass(Role, response);
            }),
            tap((role) => {
                this.store.dispatch(updateCurrentRoleAction({ role }));
                this.getCurrentRoleState.onSuccess();
            }),
        );
    }

    getCurrentPermissions() {
        if (this.getCurrentRoleState.isLoading()) {
            return this.getCurrentPermissionsRequest$;
        }
        this.getCurrentRoleState.submit();
        this.getCurrentPermissionsRequest$ = this.http.getSecure(`role/my-permissions`).pipe(
            map((response: RolePermission[]) => {
                return response;
            }),
            tap((rolePermissions) => {
                this.store.dispatch(updateCurrentPermissions({ permissions: rolePermissions }));
                this.getCurrentRoleState.onSuccess();
            }),
        );

        return this.getCurrentPermissionsRequest$;
    }

    createRole(dto: CreateRoleDto): Observable<Role> {
        return this.http.postSecure('role', dto).pipe(
            map((response: object) => {
                return plainToClass(Role, response);
            }),
            tap((result) => {
                this.store.dispatch(roleNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateRole(id: number, dto: UpdateRoleDto): Observable<Role> {
        return this.http.postSecure(`role/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Role, response);
            }),
            tap((result) => {
                this.store.dispatch(roleNgrxHelper.updateOne({ item: { id: result.roleId, changes: result } }));
            }),
        );
    }

    deleteRole(roleId: number) {
        return this.http.deleteSecure(`role/${roleId}`).pipe(
            map((response: object) => {
                return plainToClass(Role, response);
            }),
            tap((role) => {
                this.store.dispatch(roleNgrxHelper.deleteOne({ id: `${role.roleId}` }));
            }),
        );
    }
}
