import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Driver } from '@modules/shared/models/entities/driver.model';

@Component({
    selector: 'rp-create-driver-modal',
    templateUrl: './create-driver-modal.component.html',
    styleUrls: ['./create-driver-modal.component.less'],
})
export class CreateDriverModalComponent implements OnInit {
    createDriverState: ElementStateModel<Driver> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Driver>) {
        this.createDriverState = state;

        if (this.createDriverState.hasSucceeded()) {
            this.message.success(this.createDriverState.successResult().message);
            this.modal.close(this.createDriverState);
        } else if (this.createDriverState.hasFailed()) {
            this.message.error(this.createDriverState.failedResult().message);
        }
    }
}
