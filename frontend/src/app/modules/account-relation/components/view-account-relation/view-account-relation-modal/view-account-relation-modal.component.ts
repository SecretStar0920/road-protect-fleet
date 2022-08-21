import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-account-relation-modal',
    templateUrl: './view-account-relation-modal.component.html',
    styleUrls: ['./view-account-relation-modal.component.less'],
})
export class ViewAccountRelationModalComponent implements OnInit {
    @Input() accountRelationId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
