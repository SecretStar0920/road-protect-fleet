import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-role-modal',
    templateUrl: './view-role-modal.component.html',
    styleUrls: ['./view-role-modal.component.less'],
})
export class ViewRoleModalComponent implements OnInit {
    @Input() roleId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
