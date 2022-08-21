import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Document } from '@modules/shared/models/entities/document.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-document-page',
    templateUrl: './create-document-page.component.html',
    styleUrls: ['./create-document-page.component.less'],
})
export class CreateDocumentPageComponent implements OnInit {
    createDocumentState: ElementStateModel<Document> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Document>) {
        this.createDocumentState = state;

        if (this.createDocumentState.hasSucceeded()) {
            this.message.success(this.createDocumentState.successResult().message);
        } else if (this.createDocumentState.hasFailed()) {
            this.message.error(this.createDocumentState.failedResult().message);
        }
    }
}
