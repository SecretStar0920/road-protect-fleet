import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-create-user-modal',
    templateUrl: './create-user-modal.component.html',
    styleUrls: ['./create-user-modal.component.less'],
})
export class CreateUserModalComponent implements OnInit {
    createUserState: ElementStateModel<User> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<User>) {
        this.createUserState = state;

        if (this.createUserState.hasSucceeded()) {
            this.message.success(this.createUserState.successResult().message);
            this.modal.close(this.createUserState);
        } else if (this.createUserState.hasFailed()) {
            this.message.error(this.createUserState.failedResult().message);
        }
    }
}
