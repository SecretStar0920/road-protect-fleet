import { Component, Input, OnInit } from '@angular/core';
import { Contract, ContractStatus } from '@modules/shared/models/entities/contract.model';

@Component({
    selector: 'rp-contract-status-tag',
    templateUrl: './contract-status-tag.component.html',
    styleUrls: ['./contract-status-tag.component.less'],
})
export class ContractStatusTagComponent implements OnInit {
    @Input() contract: Contract;
    leaseStatus = ContractStatus;

    constructor() {}

    ngOnInit() {}
}
