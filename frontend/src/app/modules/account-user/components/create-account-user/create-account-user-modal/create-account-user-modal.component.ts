import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';

@Component({
    selector: 'rp-create-account-user-modal',
    templateUrl: './create-account-user-modal.component.html',
    styleUrls: ['./create-account-user-modal.component.less'],
})
export class CreateAccountUserModalComponent implements OnInit {
    @Input() accountId: number;

    createAccountUserState: ElementStateModel<AccountUser> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<AccountUser>) {
        this.createAccountUserState = state;

        if (this.createAccountUserState.hasSucceeded()) {
            this.message.success(this.createAccountUserState.successResult().message);
            this.modal.close(this.createAccountUserState);
        } else if (this.createAccountUserState.hasFailed()) {
            this.message.error(this.createAccountUserState.failedResult().message);
        }
    }
}
