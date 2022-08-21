import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '@modules/account/services/account.service';
import { Account } from '@modules/shared/models/entities/account.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

export interface IInfringementReportOutcome {
    // Function ran successfully
    success: boolean;
    // Email was sent, function can run successfully without sending an email if account doesnt have infringements to report
    emailSent: boolean;
}

@Component({
    selector: 'rp-email-account-infringement-report',
    templateUrl: './email-account-infringement-report.component.html',
    styleUrls: ['./email-account-infringement-report.component.less'],
})
export class EmailAccountInfringementReportComponent implements OnInit {
    sendInfringementReportState: ElementStateModel = new ElementStateModel();
    @Input() account: Account;

    constructor(private accountQueryService: AccountService, private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onSendInfringementReport() {
        this.sendInfringementReportState.submit();

        this.accountQueryService.sendAccountInfringementReport(this.account.accountId).subscribe(
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
