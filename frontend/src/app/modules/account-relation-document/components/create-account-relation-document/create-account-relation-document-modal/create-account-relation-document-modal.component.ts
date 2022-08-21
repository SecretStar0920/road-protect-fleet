import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';

@Component({
    selector: 'rp-create-account-relation-document-modal',
    templateUrl: './create-account-relation-document-modal.component.html',
    styleUrls: ['./create-account-relation-document-modal.component.less'],
})
export class CreateAccountRelationDocumentModalComponent implements OnInit {
    createAccountRelationDocumentState: ElementStateModel<AccountRelationDocument> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<AccountRelationDocument>) {
        this.createAccountRelationDocumentState = state;

        if (this.createAccountRelationDocumentState.hasSucceeded()) {
            this.message.success(this.createAccountRelationDocumentState.successResult().message);
            this.modal.close(this.createAccountRelationDocumentState);
        } else if (this.createAccountRelationDocumentState.hasFailed()) {
            this.message.error(this.createAccountRelationDocumentState.failedResult().message);
        }
    }
}
