import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-account-page',
    templateUrl: './create-account-page.component.html',
    styleUrls: ['./create-account-page.component.less'],
})
export class CreateAccountPageComponent implements OnInit {
    createAccountState: ElementStateModel<Account> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Account>) {
        this.createAccountState = state;

        if (this.createAccountState.hasSucceeded()) {
            this.message.success(this.createAccountState.successResult().message);
        } else if (this.createAccountState.hasFailed()) {
            this.message.error(this.createAccountState.failedResult().message);
        }
    }
}
