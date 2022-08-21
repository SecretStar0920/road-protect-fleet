import { Component, Input, OnInit } from '@angular/core';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-infringement-status-tag',
    templateUrl: './infringement-status-tag.component.html',
    styleUrls: ['./infringement-status-tag.component.less'],
})
export class InfringementStatusTagComponent implements OnInit {
    @Input() status: InfringementStatus;
    infringementStatus = InfringementStatus;

    constructor() {}

    ngOnInit() {}
}
