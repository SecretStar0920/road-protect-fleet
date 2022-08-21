import { Component, Input, OnInit } from '@angular/core';
import { ManualPayment, MunicipalPayment, Payment } from '@modules/shared/models/entities/payment.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-view-infringement-payments',
    templateUrl: './view-infringement-payments.component.html',
    styleUrls: ['./view-infringement-payments.less'],
})
export class ViewInfringementPaymentsComponent implements OnInit {
    @Input() infringement: Infringement;
    constructor() {}

    asMunicipalPayment(payment: Payment): MunicipalPayment {
        return payment as MunicipalPayment;
    }

    asManualPayment(payment: Payment): ManualPayment {
        return payment as ManualPayment;
    }
    ngOnInit(): void {}
}
