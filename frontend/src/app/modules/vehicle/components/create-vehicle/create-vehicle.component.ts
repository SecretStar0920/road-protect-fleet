import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VehicleService } from '@modules/vehicle/services/vehicle.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NominationTarget, Vehicle, VehicleType } from '@modules/shared/models/entities/vehicle.model';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { vehicleManufacturers } from '@modules/shared/constants/vehicle-manufacturers';
import { ContractService } from '@modules/contract/services/contract.service';
import { LeaseContractService } from '@modules/contract/modules/lease-contract/services/lease-contract.service';
import { OwnershipContractService } from '@modules/contract/modules/ownership-contract/services/ownership-contract.service';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-vehicle',
    templateUrl: './create-vehicle.component.html',
    styleUrls: ['./create-vehicle.component.less'],
})
export class CreateVehicleComponent implements OnInit {
    form: FormGroup;
    createVehicleState: ElementStateModel<Vehicle> = new ElementStateModel();
    createLeaseState: ElementStateModel = new ElementStateModel();
    createOwnershipState: ElementStateModel = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    @Input() accountId: number;
    @Input() ownerId: number;

    manufacturers = vehicleManufacturers;

    stepper: Stepper<FormGroup> = new Stepper<FormGroup>([
        new Step({
            title: i18next.t('create-vehicle.step_1'),
            validatorFunction: (data) => data.controls.ownershipContract['controls'].vehicle.valid,
        }),
        new Step({
            title: i18next.t('create-vehicle.step_2'),
            description: i18next.t('create-vehicle.optional'),
            validatorFunction: (data) => true,
        }),
        new Step({
            title: i18next.t('create-vehicle.step_3'),
            description: i18next.t('create-vehicle.optional'),
            validatorFunction: (data) => true,
        }),
        new Step({ title: i18next.t('create-vehicle.step_4') }),
    ]);

    autoAssignTo = NominationTarget;

    get f() {
        return this.form.controls;
    }

    constructor(
        private vehicleService: VehicleService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private contractService: ContractService,
        private leaseContractService: LeaseContractService,
        private ownershipContractService: OwnershipContractService,
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            // To do, rather use contract creation components
            details: new FormGroup({
                registration: new FormControl('', Validators.required),
                manufacturer: new FormControl('', Validators.required),
                model: new FormControl('', []),
                modelYear: new FormControl(null, []),
                color: new FormControl('', []),
                category: new FormControl('', []),
                weight: new FormControl(1000, []),
                type: new FormControl(VehicleType.Private, []),
            }),

            leaseContract: new FormGroup({
                vehicle: new FormControl(null, Validators.required),
                user: new FormControl({ value: this.accountId, disabled: !!this.accountId }, Validators.required),
                owner: new FormControl({ value: this.ownerId, disabled: !!this.ownerId }, Validators.required),
                startDate: new FormControl(null, Validators.required),
                endDate: new FormControl(null, Validators.required),
            }),

            ownershipContract: new FormGroup({
                vehicle: new FormControl(null, Validators.required),
                owner: new FormControl({ value: this.ownerId, disabled: !!this.ownerId }, Validators.required),
                startDate: new FormControl(null, Validators.required),
                endDate: new FormControl(null),
            }),
        });
        this.stepper.data = this.form;
    }

    onCreateVehicle() {
        this.createVehicleState.submit();
        this.vehicleService.createVehicle(this.form.getRawValue().details).subscribe(
            (result) => {
                this.logger.info('Successfully created Vehicle', result);
                this.createVehicleState.onSuccess(i18next.t('create-vehicle.success'), result);
                this.form.controls.leaseContract['controls'].vehicle.setValue(result.vehicleId);
                this.form.controls.ownershipContract['controls'].vehicle.setValue(result.vehicleId);
                this.stepper.next();
            },
            (error) => {
                this.logger.error('Failed to create Vehicle', error);
                this.createVehicleState.onFailure(i18next.t('create-vehicle.fail'), error.error);
            },
        );
    }

    onCreateOwnershipContract() {
        this.createOwnershipState.submit();
        const ownershipContractDetails = this.form.getRawValue().ownershipContract;
        this.ownershipContractService.createOwnershipContract(ownershipContractDetails).subscribe(
            (result) => {
                this.createOwnershipState.onSuccess(i18next.t('create-vehicle.success_ownership'));
                this.form.controls.leaseContract['controls'].owner.setValue(ownershipContractDetails.owner);
                this.stepper.next();
            },
            (error) => {
                this.createOwnershipState.onFailure();
            },
        );
    }

    onCreateLeaseContract() {
        this.createLeaseState.submit();
        this.leaseContractService.createLeaseContract(this.form.getRawValue().leaseContract).subscribe(
            (result) => {
                this.createLeaseState.onSuccess(i18next.t('create-vehicle.success_lease'));
                this.stepper.next();
            },
            (error) => {
                this.createLeaseState.onFailure();
            },
        );
    }

    onDone() {
        this.vehicleService.getVehicle(this.createVehicleState.successResult().context.vehicleId).subscribe();
        this.complete.emit(this.createVehicleState);
    }
}
