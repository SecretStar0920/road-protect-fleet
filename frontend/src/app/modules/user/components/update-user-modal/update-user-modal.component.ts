import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-update-user-modal',
    templateUrl: './update-user-modal.component.html',
    styleUrls: ['./update-user-modal.component.less'],
})
export class UpdateUserModalComponent implements OnInit {
    @Input() userId: number;
    updateUserState: ElementStateModel<User> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<User>) {
        this.updateUserState = state;

        if (this.updateUserState.hasSucceeded()) {
            this.message.success(this.updateUserState.successResult().message);
            this.modal.close(this.updateUserState);
        } else if (this.updateUserState.hasFailed()) {
            this.message.error(this.updateUserState.failedResult().message);
        }
    }
}
