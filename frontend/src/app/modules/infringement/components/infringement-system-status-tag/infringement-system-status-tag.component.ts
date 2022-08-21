import { Component, Input, OnInit } from '@angular/core';
import { InfringementSystemStatus } from '@modules/shared/models/entities/infringement.model';

@Component({
    selector: 'rp-infringement-system-status-tag',
    templateUrl: './infringement-system-status-tag.component.html',
    styleUrls: ['./infringement-system-status-tag.component.less'],
})
export class InfringementSystemStatusTagComponent implements OnInit {
    @Input() status: InfringementSystemStatus;

    statuses = InfringementSystemStatus;

    constructor() {}

    ngOnInit() {}
}
