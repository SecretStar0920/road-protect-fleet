import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-account-user-modal',
    templateUrl: './view-account-user-modal.component.html',
    styleUrls: ['./view-account-user-modal.component.less'],
})
export class ViewAccountUserModalComponent implements OnInit {
    @Input() accountUserId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
