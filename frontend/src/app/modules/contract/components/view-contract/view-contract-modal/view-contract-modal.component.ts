import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-contract-modal',
    templateUrl: './view-contract-modal.component.html',
    styleUrls: ['./view-contract-modal.component.less'],
})
export class ViewContractModalComponent implements OnInit {
    @Input() contractId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
