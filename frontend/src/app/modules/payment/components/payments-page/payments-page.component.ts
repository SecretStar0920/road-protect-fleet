import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreatePaymentModalComponent } from '@modules/payment/components/create-payment/create-payment-modal/create-payment-modal.component';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-payments-page',
    templateUrl: './payments-page.component.html',
    styleUrls: ['./payments-page.component.less'],
})
export class PaymentsPageComponent implements OnInit {
    viewPaymentModal: NzModalRef<any>;
    createPaymentModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewPayment(paymentId: number) {
        if (!paymentId) {
            this.logger.warn('Tried to view an Payment without an payment id');
            return;
        }
        this.router.navigate(['/home', 'payments', 'view', paymentId]);
        // Modal version
        // this.viewPaymentModal = this.modalService.create({
        //     nzTitle: 'View Payment',
        //     nzContent: ViewPaymentModalComponent,
        //     nzComponentParams: {
        //         paymentId
        //     },
        //     nzFooter: null
        // });
    }

    onCreatePayment() {
        this.createPaymentModal = this.modalService.create({
            nzTitle: i18next.t('payments-page.create_payment'),
            nzContent: CreatePaymentModalComponent,
            nzFooter: null,
        });
    }
}
