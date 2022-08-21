import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-user-page',
    templateUrl: './create-user-page.component.html',
    styleUrls: ['./create-user-page.component.less'],
})
export class CreateUserPageComponent implements OnInit {
    createUserState: ElementStateModel<User> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<User>) {
        this.createUserState = state;

        if (this.createUserState.hasSucceeded()) {
            this.message.success(this.createUserState.successResult().message);
        } else if (this.createUserState.hasFailed()) {
            this.message.error(this.createUserState.failedResult().message);
        }
    }
}
