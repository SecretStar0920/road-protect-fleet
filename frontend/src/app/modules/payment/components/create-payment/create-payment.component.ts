import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PaymentService } from '@modules/payment/services/payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Payment } from '@modules/shared/models/entities/payment.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-payment',
    templateUrl: './create-payment.component.html',
    styleUrls: ['./create-payment.component.less'],
})
export class CreatePaymentComponent implements OnInit {
    createPaymentForm: FormGroup;
    createPaymentState: ElementStateModel<Payment> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    get f() {
        return this.createPaymentForm.controls;
    }

    constructor(private paymentService: PaymentService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createPaymentForm = this.fb.group({
            // name: new FormControl('', Validators.required),
            // identifier: new FormControl('', Validators.required)
        });
    }

    onCreatePayment() {
        this.createPaymentState.submit();
        this.paymentService.createPayment(this.createPaymentForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Payment', result);
                this.createPaymentState.onSuccess(i18next.t('create-payment.success'), result);
                this.complete.emit(this.createPaymentState);
            },
            (error) => {
                this.logger.error('Failed to create Payment', error);
                this.createPaymentState.onFailure(i18next.t('create-payment.success'), error.error);
                this.complete.emit(this.createPaymentState);
            },
        );
    }
}
