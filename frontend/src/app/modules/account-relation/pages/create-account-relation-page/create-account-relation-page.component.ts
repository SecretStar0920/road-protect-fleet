import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-account-relation-page',
    templateUrl: './create-account-relation-page.component.html',
    styleUrls: ['./create-account-relation-page.component.less'],
})
export class CreateAccountRelationPageComponent implements OnInit {
    createAccountRelationState: ElementStateModel<AccountRelation> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<AccountRelation>) {
        this.createAccountRelationState = state;

        if (this.createAccountRelationState.hasSucceeded()) {
            this.message.success(this.createAccountRelationState.successResult().message);
        } else if (this.createAccountRelationState.hasFailed()) {
            this.message.error(this.createAccountRelationState.failedResult().message);
        }
    }
}
