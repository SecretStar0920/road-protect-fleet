import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '@modules/shared/models/entities/role.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { RoleService } from '@modules/role/services/role.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-role',
    templateUrl: './update-role.component.html',
    styleUrls: ['./update-role.component.less'],
})
export class UpdateRoleComponent implements OnInit {
    @Input() role: Role;

    updateRoleForm: FormGroup;
    updateRoleState: ElementStateModel<Role> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Role>> = new EventEmitter();

    get f() {
        return this.updateRoleForm.controls;
    }

    constructor(private roleService: RoleService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateRoleForm = this.fb.group({
            // name: new FormControl(this.role.name, Validators.required),
            // identifier: new FormControl(this.role.identifier, Validators.required),
        });
    }

    onUpdateRole() {
        this.updateRoleState.submit();
        this.roleService.updateRole(this.role.roleId, this.updateRoleForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Role', result);
                this.updateRoleState.onSuccess(i18next.t('update-role.success'), result);
                this.complete.emit(this.updateRoleState);
            },
            (error) => {
                this.logger.error('Failed to update Role', error);
                this.updateRoleState.onFailure(i18next.t('update-role.fail'), error.error);
                this.complete.emit(this.updateRoleState);
            },
        );
    }
}
