import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-account-user-page',
    templateUrl: './create-account-user-page.component.html',
    styleUrls: ['./create-account-user-page.component.less'],
})
export class CreateAccountUserPageComponent implements OnInit {
    createAccountUserState: ElementStateModel<AccountUser> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<AccountUser>) {
        this.createAccountUserState = state;

        if (this.createAccountUserState.hasSucceeded()) {
            this.message.success(this.createAccountUserState.successResult().message);
        } else if (this.createAccountUserState.hasFailed()) {
            this.message.error(this.createAccountUserState.failedResult().message);
        }
    }
}
