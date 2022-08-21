import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Payment } from '@modules/shared/models/entities/payment.model';

@Component({
    selector: 'rp-create-payment-modal',
    templateUrl: './create-payment-modal.component.html',
    styleUrls: ['./create-payment-modal.component.less'],
})
export class CreatePaymentModalComponent implements OnInit {
    createPaymentState: ElementStateModel<Payment> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Payment>) {
        this.createPaymentState = state;

        if (this.createPaymentState.hasSucceeded()) {
            this.message.success(this.createPaymentState.successResult().message);
            this.modal.close(this.createPaymentState);
        } else if (this.createPaymentState.hasFailed()) {
            this.message.error(this.createPaymentState.failedResult().message);
        }
    }
}
