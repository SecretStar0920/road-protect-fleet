import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';

@Component({
    selector: 'rp-create-account-relation-modal',
    templateUrl: './create-account-relation-modal.component.html',
    styleUrls: ['./create-account-relation-modal.component.less'],
})
export class CreateAccountRelationModalComponent implements OnInit {
    createAccountRelationState: ElementStateModel<AccountRelation> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<AccountRelation>) {
        this.createAccountRelationState = state;

        if (this.createAccountRelationState.hasSucceeded()) {
            this.message.success(this.createAccountRelationState.successResult().message);
            this.modal.close(this.createAccountRelationState);
        } else if (this.createAccountRelationState.hasFailed()) {
            this.message.error(this.createAccountRelationState.failedResult().message);
        }
    }
}
