import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-account-relation-document-page',
    templateUrl: './create-account-relation-document-page.component.html',
    styleUrls: ['./create-account-relation-document-page.component.less'],
})
export class CreateAccountRelationDocumentPageComponent implements OnInit {
    createAccountRelationDocumentState: ElementStateModel<AccountRelationDocument> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<AccountRelationDocument>) {
        this.createAccountRelationDocumentState = state;

        if (this.createAccountRelationDocumentState.hasSucceeded()) {
            this.message.success(this.createAccountRelationDocumentState.successResult().message);
        } else if (this.createAccountRelationDocumentState.hasFailed()) {
            this.message.error(this.createAccountRelationDocumentState.failedResult().message);
        }
    }
}
