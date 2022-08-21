import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-create-partial-infringement-modal',
    templateUrl: './create-partial-infringement-modal.component.html',
    styleUrls: ['./create-partial-infringement-modal.component.less'],
})
export class CreatePartialInfringementModalComponent implements OnInit {
    createPartialInfringementState: ElementStateModel<PartialInfringement> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<PartialInfringement>) {
        this.createPartialInfringementState = state;

        if (this.createPartialInfringementState.hasSucceeded()) {
            this.message.success(this.createPartialInfringementState.successResult().message);
            this.modal.close(this.createPartialInfringementState);
        } else if (this.createPartialInfringementState.hasFailed()) {
            this.message.error(this.createPartialInfringementState.failedResult().message);
        }
    }
}
