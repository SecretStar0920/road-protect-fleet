import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-payment-modal',
    templateUrl: './view-payment-modal.component.html',
    styleUrls: ['./view-payment-modal.component.less'],
})
export class ViewPaymentModalComponent implements OnInit {
    @Input() paymentId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
