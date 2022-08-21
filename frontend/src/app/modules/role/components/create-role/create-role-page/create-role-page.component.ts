import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Role } from '@modules/shared/models/entities/role.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-role-page',
    templateUrl: './create-role-page.component.html',
    styleUrls: ['./create-role-page.component.less'],
})
export class CreateRolePageComponent implements OnInit {
    createRoleState: ElementStateModel<Role> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Role>) {
        this.createRoleState = state;

        if (this.createRoleState.hasSucceeded()) {
            this.message.success(this.createRoleState.successResult().message);
        } else if (this.createRoleState.hasFailed()) {
            this.message.error(this.createRoleState.failedResult().message);
        }
    }
}
