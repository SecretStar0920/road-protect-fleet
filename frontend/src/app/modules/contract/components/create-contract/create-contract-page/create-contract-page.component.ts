import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-contract-page',
    templateUrl: './create-contract-page.component.html',
    styleUrls: ['./create-contract-page.component.less'],
})
export class CreateContractPageComponent implements OnInit {
    createContractState: ElementStateModel<Contract> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Contract>) {
        this.createContractState = state;

        if (this.createContractState.hasSucceeded()) {
            this.message.success(this.createContractState.successResult().message);
        } else if (this.createContractState.hasFailed()) {
            this.message.error(this.createContractState.failedResult().message);
        }
    }
}
