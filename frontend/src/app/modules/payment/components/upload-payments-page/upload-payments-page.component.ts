import { Component, OnInit } from '@angular/core';
import { UploadManualProofOfPaymentDto } from '@modules/payment/services/create-payment.dto';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { PaymentSpreadsheetService } from '@modules/payment/services/payment-spreadsheet.service';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';

@Component({
    selector: 'rp-upload-payments-page',
    templateUrl: './upload-payments-page.component.html',
    styleUrls: ['./upload-payments-page.component.less'],
})
export class UploadPaymentsPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<Payment>;

    constructor(private paymentSpreadsheetService: PaymentSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<Payment>(
            'payment',
            {
                uploadManualProof: new UploadOption({
                    dto: UploadManualProofOfPaymentDto,
                    service: this.paymentSpreadsheetService,
                    useTranslationForHeading: false
                }),
                // update: {
                //     dto: UpdatePaymentDto,
                //     service: this.paymentSpreadsheetService
                // }
            },
            [
                'uploadManualProof',
                // 'update',
            ],
        );
    }

    ngOnInit() {}
}
