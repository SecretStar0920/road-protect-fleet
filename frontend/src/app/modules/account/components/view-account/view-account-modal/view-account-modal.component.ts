import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-account-modal',
    templateUrl: './view-account-modal.component.html',
    styleUrls: ['./view-account-modal.component.less'],
})
export class ViewAccountModalComponent implements OnInit {
    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
