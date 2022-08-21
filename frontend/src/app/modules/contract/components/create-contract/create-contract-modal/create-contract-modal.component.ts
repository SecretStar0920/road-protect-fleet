import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Contract, ContractType } from '@modules/shared/models/entities/contract.model';

@Component({
    selector: 'rp-create-contract-modal',
    templateUrl: './create-contract-modal.component.html',
    styleUrls: ['./create-contract-modal.component.less'],
})
export class CreateContractModalComponent implements OnInit {
    @Input() vehicleId: number;
    @Input() type: ContractType = ContractType.Lease;
    contractTypes = ContractType;

    createContractState: ElementStateModel<Contract> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Contract>) {
        this.createContractState = state;

        if (this.createContractState.hasSucceeded()) {
            this.modal.close(this.createContractState);
        } else if (this.createContractState.hasFailed()) {
        }
    }
}
