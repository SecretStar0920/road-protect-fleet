import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Role } from '@modules/shared/models/entities/role.model';

@Component({
    selector: 'rp-create-role-modal',
    templateUrl: './create-role-modal.component.html',
    styleUrls: ['./create-role-modal.component.less'],
})
export class CreateRoleModalComponent implements OnInit {
    createRoleState: ElementStateModel<Role> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Role>) {
        this.createRoleState = state;

        if (this.createRoleState.hasSucceeded()) {
            this.message.success(this.createRoleState.successResult().message);
            this.modal.close(this.createRoleState);
        } else if (this.createRoleState.hasFailed()) {
            this.message.error(this.createRoleState.failedResult().message);
        }
    }
}
