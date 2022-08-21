import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { IInfringementReportOutcome } from '@modules/account/components/email-account-infringement-report/email-account-infringement-report.component';

@Component({
    selector: 'rp-email-account-relation-infringement-report',
    templateUrl: './email-account-relation-infringement-report.component.html',
    styleUrls: ['./email-account-relation-infringement-report.component.less'],
})
export class EmailAccountRelationInfringementReportComponent implements OnInit {
    sendInfringementReportState: ElementStateModel = new ElementStateModel();
    @Input() accountRelation: AccountRelation;

    constructor(
        private accountRelationApiService: AccountRelationApiService,
        private modal: NzModalRef,
        private message: NzMessageService,
    ) {}

    ngOnInit() {}

    onSendInfringementReport() {
        this.sendInfringementReportState.submit();

        this.accountRelationApiService.sendAccountRelationInfringementReport(this.accountRelation.accountRelationId).subscribe(
            (result: IInfringementReportOutcome) => {
                if (result.emailSent) {
                    this.sendInfringementReportState.onSuccess('Infringement report was sent', result);
                } else {
                    this.sendInfringementReportState.onSuccess('No infringements to report', result);
                }

                this.message.success(this.sendInfringementReportState.successResult().message);
                this.modal.close();
            },
            (error) => {
                this.sendInfringementReportState.onFailure('An error occurred while sending the infringement report', error);
            },
        );
    }
}
