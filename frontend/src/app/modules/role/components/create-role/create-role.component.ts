import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RoleService } from '@modules/role/services/role.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Role } from '@modules/shared/models/entities/role.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-role',
    templateUrl: './create-role.component.html',
    styleUrls: ['./create-role.component.less'],
})
export class CreateRoleComponent implements OnInit {
    createRoleForm: FormGroup;
    createRoleState: ElementStateModel<Role> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    get f() {
        return this.createRoleForm.controls;
    }

    constructor(private roleService: RoleService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createRoleForm = this.fb.group({
            // name: new FormControl('', Validators.required),
            // identifier: new FormControl('', Validators.required)
        });
    }

    onCreateRole() {
        this.createRoleState.submit();
        this.roleService.createRole(this.createRoleForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Role', result);
                this.createRoleState.onSuccess(i18next.t('create-role-page.success'), result);
                this.complete.emit(this.createRoleState);
            },
            (error) => {
                this.logger.error('Failed to create Role', error);
                this.createRoleState.onFailure(i18next.t('create-role-page.fail'), error.error);
                this.complete.emit(this.createRoleState);
            },
        );
    }
}
