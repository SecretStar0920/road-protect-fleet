import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-account-relation-document-modal',
    templateUrl: './view-account-relation-document-modal.component.html',
    styleUrls: ['./view-account-relation-document-modal.component.less'],
})
export class ViewAccountRelationDocumentModalComponent implements OnInit {
    @Input() accountRelationDocumentId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
