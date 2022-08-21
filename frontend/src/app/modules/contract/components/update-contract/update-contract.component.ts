import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { ContractService } from '@modules/contract/services/contract.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-contract',
    templateUrl: './update-contract.component.html',
    styleUrls: ['./update-contract.component.less'],
})
export class UpdateContractComponent implements OnInit {
    @Input() contract: Contract;

    updateContractForm: FormGroup;
    updateContractState: ElementStateModel<Contract> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Contract>> = new EventEmitter();

    get f() {
        return this.updateContractForm.controls;
    }

    constructor(private contractService: ContractService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateContractForm = this.fb.group({
            // name: new FormControl(this.contract.name, Validators.required),
            // identifier: new FormControl(this.contract.identifier, Validators.required),
        });
    }

    onUpdateContract() {
        this.updateContractState.submit();
        this.contractService.UpdateContractDocument(this.contract.contractId, this.updateContractForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Vehicle Contract', result);
                this.updateContractState.onSuccess(i18next.t('update-contract.success'), result);
                this.complete.emit(this.updateContractState);
            },
            (error) => {
                this.logger.error('Failed to update Vehicle Contract', error);
                this.updateContractState.onFailure(i18next.t('update-contract.fail'), error.error);
                this.complete.emit(this.updateContractState);
            },
        );
    }
}
