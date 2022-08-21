import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { PaymentService } from '@modules/payment/services/payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-payment',
    templateUrl: './delete-payment.component.html',
    styleUrls: ['./delete-payment.component.less'],
})
export class DeletePaymentComponent implements OnInit {
    @Input() paymentId: number;

    deletePaymentState: ElementStateModel<Payment> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Payment>> = new EventEmitter();

    constructor(private paymentService: PaymentService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deletePaymentState.submit();
        this.paymentService.deletePayment(this.paymentId).subscribe(
            (payment) => {
                this.deletePaymentState.onSuccess(i18next.t('delete-payment.success'), payment);
                this.message.success(this.deletePaymentState.successResult().message);
                this.delete.emit(this.deletePaymentState);
            },
            (error) => {
                this.deletePaymentState.onFailure(i18next.t('delete-payment.fail'), error);
                this.message.error(this.deletePaymentState.failedResult().message);
            },
        );
    }
}
