import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-nomination-modal',
    templateUrl: './create-nomination-modal.component.html',
    styleUrls: ['./create-nomination-modal.component.less'],
})
export class CreateNominationModalComponent implements OnInit {
    createNominationState: ElementStateModel<Nomination> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Nomination>) {
        this.createNominationState = state;

        if (this.createNominationState.hasSucceeded()) {
            this.message.success(this.createNominationState.successResult().message);
            this.modal.close(this.createNominationState);
        } else if (this.createNominationState.hasFailed()) {
            this.message.error(this.createNominationState.failedResult().message);
        }
    }
}
