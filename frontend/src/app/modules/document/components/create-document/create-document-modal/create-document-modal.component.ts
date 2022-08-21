import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Document } from '@modules/shared/models/entities/document.model';

@Component({
    selector: 'rp-create-document-modal',
    templateUrl: './create-document-modal.component.html',
    styleUrls: ['./create-document-modal.component.less'],
})
export class CreateDocumentModalComponent implements OnInit {
    createDocumentState: ElementStateModel<Document> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Document>) {
        this.createDocumentState = state;

        if (this.createDocumentState.hasSucceeded()) {
            this.message.success(this.createDocumentState.successResult().message);
            this.modal.close(this.createDocumentState);
        } else if (this.createDocumentState.hasFailed()) {
            this.message.error(this.createDocumentState.failedResult().message);
        }
    }
}
