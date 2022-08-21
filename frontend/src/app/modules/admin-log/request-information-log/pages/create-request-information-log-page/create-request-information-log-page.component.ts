import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-request-information-log-page',
    templateUrl: './create-request-information-log-page.component.html',
    styleUrls: ['./create-request-information-log-page.component.less'],
})
export class CreateRequestInformationLogPageComponent implements OnInit {
    createRequestInformationLogState: ElementStateModel<RequestInformationLog> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<RequestInformationLog>) {
        this.createRequestInformationLogState = state;

        if (this.createRequestInformationLogState.hasSucceeded()) {
            this.message.success(this.createRequestInformationLogState.successResult().message);
        } else if (this.createRequestInformationLogState.hasFailed()) {
            this.message.error(this.createRequestInformationLogState.failedResult().message);
        }
    }
}
