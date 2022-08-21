import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Issuer } from '@modules/shared/models/entities/issuer.model';

@Component({
    selector: 'rp-create-issuer-modal',
    templateUrl: './create-issuer-modal.component.html',
    styleUrls: ['./create-issuer-modal.component.less'],
})
export class CreateIssuerModalComponent implements OnInit {
    createIssuerState: ElementStateModel<Issuer> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Issuer>) {
        this.createIssuerState = state;

        if (this.createIssuerState.hasSucceeded()) {
            this.message.success(this.createIssuerState.successResult().message);
            this.modal.close(this.createIssuerState);
        } else if (this.createIssuerState.hasFailed()) {
            this.message.error(this.createIssuerState.failedResult().message);
        }
    }
}
