import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Account } from '@modules/shared/models/entities/account.model';

@Component({
    selector: 'rp-create-account-modal',
    templateUrl: './create-account-modal.component.html',
    styleUrls: ['./create-account-modal.component.less'],
})
export class CreateAccountModalComponent implements OnInit {
    createAccountState: ElementStateModel<Account> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Account>) {
        this.createAccountState = state;

        if (this.createAccountState.hasSucceeded()) {
            this.message.success(this.createAccountState.successResult().message);
            this.modal.close(this.createAccountState);
        } else if (this.createAccountState.hasFailed()) {
            this.message.error(this.createAccountState.failedResult().message);
        }
    }
}
