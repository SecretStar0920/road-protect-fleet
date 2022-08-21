import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContractService } from '@modules/contract/services/contract.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-create-contract',
    templateUrl: './create-contract.component.html',
    styleUrls: ['./create-contract.component.less'],
})
export class CreateContractComponent implements OnInit {
    @Input() vehicleId: number;

    createContractForm: FormGroup;
    createContractState: ElementStateModel<Contract> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    mimeTypes = MIME_TYPES;

    stepper: Stepper<FormGroup> = new Stepper<FormGroup>([
        new Step({ title: i18next.t('create-contract.details'), validatorFunction: (data) => data.controls.details.valid }),
        new Step({ title: i18next.t('create-contract.details'), validatorFunction: (data) => data.controls.details.valid }),
        new Step({ title: i18next.t('create-contract.document'), validatorFunction: (data) => data.controls.document.valid }),
        new Step({ title: i18next.t('create-contract.create') }),
    ]);

    get f() {
        return this.createContractForm.controls;
    }

    constructor(private contractService: ContractService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createContractForm = this.fb.group({
            details: new FormGroup({
                startDate: new FormControl(null, [Validators.required]),
                endDate: new FormControl(null, Validators.required),
                vehicle: new FormControl(this.vehicleId, Validators.required),
                owner: new FormControl(null, Validators.required),
                user: new FormControl(null, Validators.required),
            }),
            document: new FormGroup({
                document: new FormControl(null, Validators.required),
            }),
        });

        this.stepper.data = this.createContractForm;
    }

    onCreateContract() {
        this.createContractState.submit();
        const value = this.createContractForm.value;
        this.contractService.createContract({ ...value.details, ...value.document }).subscribe(
            (result) => {
                this.logger.info('Successfully created Vehicle Contract', result);
                this.createContractState.onSuccess(i18next.t('create-contract.success'), result);
                this.complete.emit(this.createContractState);
            },
            (error) => {
                this.logger.error('Failed to create Vehicle Contract', error);
                this.createContractState.onFailure(i18next.t('create-contract.fail'), error.error);
                this.complete.emit(this.createContractState);
            },
        );
    }
}
