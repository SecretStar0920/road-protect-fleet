import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { PaymentService } from '@modules/payment/services/payment.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-payment',
    templateUrl: './update-payment.component.html',
    styleUrls: ['./update-payment.component.less'],
})
export class UpdatePaymentComponent implements OnInit {
    @Input() payment: Payment;

    updatePaymentForm: FormGroup;
    updatePaymentState: ElementStateModel<Payment> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Payment>> = new EventEmitter();

    get f() {
        return this.updatePaymentForm.controls;
    }

    constructor(private paymentService: PaymentService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updatePaymentForm = this.fb.group({
            // name: new FormControl(this.payment.name, Validators.required),
            // identifier: new FormControl(this.payment.identifier, Validators.required),
        });
    }

    onUpdatePayment() {
        this.updatePaymentState.submit();
        this.paymentService.updatePayment(this.payment.paymentId, this.updatePaymentForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Payment', result);
                this.updatePaymentState.onSuccess(i18next.t('update-payment.success'), result);
                this.complete.emit(this.updatePaymentState);
            },
            (error) => {
                this.logger.error('Failed to update Payment', error);
                this.updatePaymentState.onFailure(i18next.t('update-payment.fail'), error.error);
                this.complete.emit(this.updatePaymentState);
            },
        );
    }
}
