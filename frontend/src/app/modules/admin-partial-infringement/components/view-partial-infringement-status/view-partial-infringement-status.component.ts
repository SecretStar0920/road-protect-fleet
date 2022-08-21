import { Component, Input, OnInit } from '@angular/core';
import { PartialInfringementStatus } from '@modules/shared/models/entities/partial-infringement.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-partial-infringement-status',
    templateUrl: './view-partial-infringement-status.component.html',
    styleUrls: ['./view-partial-infringement-status.component.less'],
})
export class ViewPartialInfringementStatusComponent implements OnInit {
    @Input() currentStatus: PartialInfringementStatus;
    partialInfringementStatus = PartialInfringementStatus;

    constructor() {}

    ngOnInit() {}
}
