import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { paymentNgrxHelper, PaymentState } from '@modules/payment/ngrx/payment.reducer';
import { plainToClass } from 'class-transformer';
import { CreatePaymentDto } from '@modules/payment/services/create-payment.dto';
import { UpdatePaymentDto } from '@modules/payment/services/update-payment.dto';
import { Payment } from '@modules/shared/models/entities/payment.model';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(private http: HttpService, private store: Store<PaymentState>) {}

    getAllPayments() {
        return this.http.getSecure('payment').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Payment, item));
                }
                return [];
            }),
            tap((payments) => {
                this.store.dispatch(paymentNgrxHelper.load({ items: payments }));
            }),
        );
    }

    getPayment(paymentId: number) {
        return this.http.getSecure(`payment/${paymentId}`).pipe(
            map((response: object) => {
                return plainToClass(Payment, response);
            }),
            tap((payment) => {
                this.store.dispatch(paymentNgrxHelper.upsertOne({ item: payment }));
            }),
        );
    }

    createPayment(dto: CreatePaymentDto): Observable<Payment> {
        return this.http.postSecure('payment', dto).pipe(
            map((response: object) => {
                return plainToClass(Payment, response);
            }),
            tap((result) => {
                this.store.dispatch(paymentNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updatePayment(id: number, dto: UpdatePaymentDto): Observable<Payment> {
        return this.http.postSecure(`payment/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Payment, response);
            }),
            tap((result) => {
                this.store.dispatch(paymentNgrxHelper.updateOne({ item: { id: result.paymentId, changes: result } }));
            }),
        );
    }

    deletePayment(paymentId: number) {
        return this.http.deleteSecure(`payment/${paymentId}`).pipe(
            map((response: object) => {
                return plainToClass(Payment, response);
            }),
            tap((payment) => {
                this.store.dispatch(paymentNgrxHelper.deleteOne({ id: `${payment.paymentId}` }));
            }),
        );
    }
}
