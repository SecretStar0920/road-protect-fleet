import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NominationTarget, Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { VehicleService } from '@modules/vehicle/services/vehicle.service';
import { NGXLogger } from 'ngx-logger';
import { getChangedObject } from '@modules/shared/functions/get-update-obj.function';
import { vehicleManufacturers } from '@modules/shared/constants/vehicle-manufacturers';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-vehicle',
    templateUrl: './update-vehicle.component.html',
    styleUrls: ['./update-vehicle.component.less'],
})
export class UpdateVehicleComponent implements OnInit {
    @Input() vehicle: Vehicle;

    updateVehicleForm: FormGroup;
    updateVehicleState: ElementStateModel<Vehicle> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Vehicle>> = new EventEmitter();
    private initialFormValue: any;

    autoAssignTo = NominationTarget;
    vehicles = vehicleManufacturers;

    get f() {
        return this.updateVehicleForm.controls;
    }

    constructor(private vehicleService: VehicleService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateVehicleForm = this.fb.group({
            registration: new FormControl(this.vehicle.registration, Validators.required),
            manufacturer: new FormControl(this.vehicle.manufacturer, Validators.required),
            model: new FormControl(this.vehicle.model, []),
            modelYear: new FormControl(this.vehicle.modelYear, []),
            color: new FormControl(this.vehicle.color, []),
            category: new FormControl(this.vehicle.category, []),
            weight: new FormControl(this.vehicle.weight, []),
            type: new FormControl(this.vehicle.type, []),
            // account: new FormControl((this.vehicle.user || {} as any).name),
            // owner: new FormControl((this.vehicle.owner || {} as any).name),
            // driver: new FormControl((this.vehicle.driver || {} as any).name),
            // autoAssignTo: new FormControl(this.vehicle.autoAssignTo, Validators.required),
        });

        // const account = this.vehicle.user;
        // if (account) {
        //     this.updateVehicleForm.controls.account.setValue(account.name);
        // }

        this.initialFormValue = this.updateVehicleForm.value;
    }

    onUpdateVehicle() {
        this.updateVehicleState.submit();
        this.vehicleService
            .updateVehicle(this.vehicle.vehicleId, getChangedObject(this.initialFormValue, this.updateVehicleForm.value))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated Vehicle', result);
                    this.updateVehicleState.onSuccess(i18next.t('update-vehicle.success'), result);
                    this.complete.emit(this.updateVehicleState);
                },
                (error) => {
                    this.logger.error('Failed to update Vehicle', error);
                    this.updateVehicleState.onFailure(i18next.t('update-vehicle.fail'), error.error);
                    this.complete.emit(this.updateVehicleState);
                },
            );
    }
}
