import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-create-infringement-modal',
    templateUrl: './create-infringement-modal.component.html',
    styleUrls: ['./create-infringement-modal.component.less'],
})
export class CreateInfringementModalComponent implements OnInit {
    createInfringementState: ElementStateModel<Infringement> = new ElementStateModel();

    @Input() vehicleId: number;
    @Input() issuerId: number;

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Infringement>) {
        this.createInfringementState = state;

        if (this.createInfringementState.hasSucceeded()) {
            this.message.success(this.createInfringementState.successResult().message);
            this.modal.close(this.createInfringementState);
        } else if (this.createInfringementState.hasFailed()) {
            this.message.error(this.createInfringementState.failedResult().message);
        }
    }
}
