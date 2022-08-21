import { Component, Input, OnInit } from '@angular/core';
import { Account } from '@modules/shared/models/entities/account.model';
import { CreditGuardIntegrationType, PaymentMethodService } from '@modules/payment/services/payment-method.service';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';

@Component({
    selector: 'rp-view-account-payment-methods',
    templateUrl: './view-account-payment-methods.component.html',
    styleUrls: ['./view-account-payment-methods.component.less'],
})
export class ViewAccountPaymentMethodsComponent implements OnInit {
    @Input() account: Account;
    creditGuardIntegrationTypes = CreditGuardIntegrationType;

    permissions = PERMISSIONS;

    constructor(private paymentMethodService: PaymentMethodService) {}

    ngOnInit() {}

    onAddPaymentMethod(type: CreditGuardIntegrationType) {
        this.paymentMethodService.addPaymentMethod(type, this.account.accountId).subscribe((url) => {
            // Navigate to the tokenisation website
            // They will return to this page with tokenisation parameterised
            // Maybe iFrame instead?
            if (url) {
                window.location.href = url.url;
            }
        });
    }
}
