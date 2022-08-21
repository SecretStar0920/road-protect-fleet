import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-driver-modal',
    templateUrl: './view-driver-modal.component.html',
    styleUrls: ['./view-driver-modal.component.less'],
})
export class ViewDriverModalComponent implements OnInit {
    @Input() driverId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
