import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-vehicle-page',
    templateUrl: './create-vehicle-page.component.html',
    styleUrls: ['./create-vehicle-page.component.less'],
})
export class CreateVehiclePageComponent implements OnInit {
    createVehicleState: ElementStateModel<Vehicle> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Vehicle>) {
        this.createVehicleState = state;

        if (this.createVehicleState.hasSucceeded()) {
            this.message.success(this.createVehicleState.successResult().message);
        } else if (this.createVehicleState.hasFailed()) {
            this.message.error(this.createVehicleState.failedResult().message);
        }
    }
}
