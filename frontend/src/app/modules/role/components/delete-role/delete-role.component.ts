import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Role } from '@modules/shared/models/entities/role.model';
import { RoleService } from '@modules/role/services/role.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-role',
    templateUrl: './delete-role.component.html',
    styleUrls: ['./delete-role.component.less'],
})
export class DeleteRoleComponent implements OnInit {
    @Input() roleId: number;

    deleteRoleState: ElementStateModel<Role> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Role>> = new EventEmitter();

    constructor(private roleService: RoleService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteRoleState.submit();
        this.roleService.deleteRole(this.roleId).subscribe(
            (role) => {
                this.deleteRoleState.onSuccess(i18next.t('delete-role.success'), role);
                this.message.success(this.deleteRoleState.successResult().message);
                this.delete.emit(this.deleteRoleState);
            },
            (error) => {
                this.deleteRoleState.onFailure(i18next.t('delete-role.fail'), error);
                this.message.error(this.deleteRoleState.failedResult().message);
            },
        );
    }
}
