import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Location } from '@modules/shared/models/entities/location.model';

@Component({
    selector: 'rp-create-location-modal',
    templateUrl: './create-location-modal.component.html',
    styleUrls: ['./create-location-modal.component.less'],
})
export class CreateLocationModalComponent implements OnInit {
    createLocationState: ElementStateModel<Location> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Location>) {
        this.createLocationState = state;

        if (this.createLocationState.hasSucceeded()) {
            this.message.success(this.createLocationState.successResult().message);
            this.modal.close(this.createLocationState);
        } else if (this.createLocationState.hasFailed()) {
            this.message.error(this.createLocationState.failedResult().message);
        }
    }
}
