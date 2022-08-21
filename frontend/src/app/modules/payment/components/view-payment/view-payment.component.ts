import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PaymentState } from '@modules/payment/ngrx/payment.reducer';
import { select, Store } from '@ngrx/store';
import { ManualPayment, MunicipalPayment, Payment, PaymentType } from '@modules/shared/models/entities/payment.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { PaymentService } from '@modules/payment/services/payment.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { getPaymentById } from '@modules/payment/ngrx/payment.selectors';

@Component({
    selector: 'rp-view-payment',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.less'],
})
export class ViewPaymentComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() paymentId: number;
    @Input() payment: Payment;
    paymentType = PaymentType;

    updatePaymentState: ElementStateModel<Payment> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Payment>> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(private store: Store<PaymentState>, private logger: NGXLogger, private paymentService: PaymentService) {}

    ngOnInit() {
        // We bind in the full payment in this case to prevent opening up an API for viewing payments yet
        // this.getPayment();
    }

    getPayment() {
        this.store
            .pipe(
                select(getPaymentById(this.paymentId), takeUntil(this.destroy$)),
                tap((payment) => {
                    if (!payment) {
                        this.logger.debug('Payment not found on store, querying for it');
                        this.paymentService.getPayment(this.paymentId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.payment = result;
            });
    }

    asManualPayment(): ManualPayment {
        return this.payment as ManualPayment;
    }

    asMunicipalPayment(): MunicipalPayment {
        return this.payment as MunicipalPayment;
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Payment>) {
        this.onUpdate();
        this.updatePaymentState = state;
    }

    onDelete(deleteState: ElementStateModel<Payment>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
