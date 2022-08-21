import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { ContractService } from '@modules/contract/services/contract.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-contract',
    templateUrl: './delete-contract.component.html',
    styleUrls: ['./delete-contract.component.less'],
})
export class DeleteContractComponent implements OnInit {
    @Input() contractId: number;

    deleteContractState: ElementStateModel<Contract> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Contract>> = new EventEmitter();

    constructor(private contractService: ContractService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteContractState.submit();
        this.delete.emit(this.deleteContractState);
        this.contractService.deleteContract(this.contractId).subscribe(
            (contract) => {
                this.deleteContractState.onSuccess(i18next.t('delete-contract.success'), contract);
                this.message.success(this.deleteContractState.successResult().message);
                this.delete.emit(this.deleteContractState);
            },
            (error) => {
                this.deleteContractState.onFailure(i18next.t('delete-contract.fail'), error);
                this.message.error(this.deleteContractState.failedResult().message);
            },
        );
    }
}
