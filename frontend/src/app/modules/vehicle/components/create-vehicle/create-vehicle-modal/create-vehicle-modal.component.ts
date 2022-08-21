import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';

@Component({
    selector: 'rp-create-vehicle-modal',
    templateUrl: './create-vehicle-modal.component.html',
    styleUrls: ['./create-vehicle-modal.component.less'],
})
export class CreateVehicleModalComponent implements OnInit {
    @Input() accountId: number;
    @Input() ownerId: number;

    createVehicleState: ElementStateModel<Vehicle> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Vehicle>) {
        this.createVehicleState = state;
        if (this.createVehicleState.hasSucceeded()) {
            this.message.success(this.createVehicleState.successResult().message);
            this.modal.close(this.createVehicleState);
        } else if (this.createVehicleState.hasFailed()) {
            this.message.error(this.createVehicleState.failedResult().message);
        }
    }
}
