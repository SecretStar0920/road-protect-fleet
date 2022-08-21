import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RoleState } from '@modules/role/ngrx/role.reducer';
import { Role } from '@modules/shared/models/entities/role.model';
import * as fromRole from '@modules/role/ngrx/role.selectors';
import { switchMap } from 'rxjs/operators';
import { RoleService } from '@modules/role/services/role.service';
import { of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isEmpty } from 'lodash';

@Component({
    selector: 'rp-role-dropdown',
    templateUrl: './role-dropdown.component.html',
    styleUrls: ['./role-dropdown.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RoleDropdownComponent),
            multi: true,
        },
    ],
})
export class RoleDropdownComponent implements OnInit, ControlValueAccessor {
    // Both onChange and onTouched are functions
    onChange: any;
    onTouched: any;

    @Input() valueKey = 'name';

    @Input()
    roles: Role[] = [];
    private _selectedRole: any;
    get selectedRole(): any {
        return this._selectedRole;
    }

    @Input()
    set selectedRole(value: any) {
        this._selectedRole = value;
        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    constructor(private store: Store<RoleState>, private roleService: RoleService) {}

    ngOnInit() {
        this.getRoles();
    }

    getRoles() {
        this.store
            .pipe(
                select(fromRole.selectAll),
                switchMap((roles) => {
                    if (isEmpty(roles)) {
                        return this.roleService.getAllRoles();
                    }
                    return of(roles);
                }),
            )
            .subscribe((roles) => {
                this.roles = roles;
            });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: number): void {
        if (value) {
            this.selectedRole = value;
        }
    }
}
