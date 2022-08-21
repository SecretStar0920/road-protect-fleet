import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-user-modal',
    templateUrl: './view-user-modal.component.html',
    styleUrls: ['./view-user-modal.component.less'],
})
export class ViewUserModalComponent implements OnInit {
    @Input() userId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
