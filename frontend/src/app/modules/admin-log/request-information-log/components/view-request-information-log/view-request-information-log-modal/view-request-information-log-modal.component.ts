import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-request-information-log-modal',
    templateUrl: './view-request-information-log-modal.component.html',
    styleUrls: ['./view-request-information-log-modal.component.less'],
})
export class ViewRequestInformationLogModalComponent implements OnInit {
    @Input() requestInformationLogId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
