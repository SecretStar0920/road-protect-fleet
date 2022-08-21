import { Component, Input, OnInit } from '@angular/core';
import { ContractOcrStatus, LeaseContract } from '@modules/shared/models/entities/contract.model';

@Component({
    selector: 'rp-contract-ocr-status-tag',
    templateUrl: './contract-ocr-status-tag.component.html',
    styleUrls: ['./contract-ocr-status-tag.component.less'],
})
export class ContractOcrStatusTagComponent implements OnInit {
    @Input() contract: LeaseContract;
    ocrStatus = ContractOcrStatus;

    constructor() {}

    ngOnInit() {}
}
