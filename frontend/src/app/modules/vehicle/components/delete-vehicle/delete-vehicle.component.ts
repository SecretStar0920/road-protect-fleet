import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { VehicleService } from '@modules/vehicle/services/vehicle.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-vehicle',
    templateUrl: './delete-vehicle.component.html',
    styleUrls: ['./delete-vehicle.component.less'],
})
export class DeleteVehicleComponent implements OnInit {
    @Input() vehicleId: number;

    deleteVehicleState: ElementStateModel<Vehicle> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Vehicle>> = new EventEmitter();

    permissions = PERMISSIONS;

    constructor(private vehicleService: VehicleService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteVehicleState.submit();
        this.delete.emit(this.deleteVehicleState);
        this.vehicleService.deleteVehicle(this.vehicleId).subscribe(
            (vehicle) => {
                this.deleteVehicleState.onSuccess(i18next.t('delete-vehicle.success'), vehicle);
                this.message.success(this.deleteVehicleState.successResult().message);
                this.delete.emit(this.deleteVehicleState);
            },
            (error) => {
                this.deleteVehicleState.onFailure(i18next.t('delete-vehicle.fail'), error);
                this.message.error(this.deleteVehicleState.failedResult().message);
            },
        );
    }
}
