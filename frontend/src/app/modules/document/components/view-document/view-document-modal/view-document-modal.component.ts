import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-document-modal',
    templateUrl: './view-document-modal.component.html',
    styleUrls: ['./view-document-modal.component.less'],
})
export class ViewDocumentModalComponent implements OnInit {
    @Input() documentId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
