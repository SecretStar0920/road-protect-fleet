import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { PaymentState } from '@modules/payment/ngrx/payment.reducer';

export enum CreditGuardIntegrationType {
    RP = 'RP',
    ATG = 'ATG',
}

@Injectable({
    providedIn: 'root',
})
export class PaymentMethodService {
    constructor(private http: HttpService, private store: Store<PaymentState>) {}

    addPaymentMethod(type: CreditGuardIntegrationType, accountId: number) {
        return this.http.getSecure(`payment/tokenisation-url/${accountId}/${type}`);
    }
}
