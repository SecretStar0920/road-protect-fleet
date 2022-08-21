import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-payment-page',
    templateUrl: './create-payment-page.component.html',
    styleUrls: ['./create-payment-page.component.less'],
})
export class CreatePaymentPageComponent implements OnInit {
    createPaymentState: ElementStateModel<Payment> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Payment>) {
        this.createPaymentState = state;

        if (this.createPaymentState.hasSucceeded()) {
            this.message.success(this.createPaymentState.successResult().message);
        } else if (this.createPaymentState.hasFailed()) {
            this.message.error(this.createPaymentState.failedResult().message);
        }
    }
}
