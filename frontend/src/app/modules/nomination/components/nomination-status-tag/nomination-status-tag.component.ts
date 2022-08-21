import { Component, Input, OnInit } from '@angular/core';
import { NominationStatus } from '@modules/shared/models/entities/nomination.model';

@Component({
    selector: 'rp-nomination-status-tag',
    templateUrl: './nomination-status-tag.component.html',
    styleUrls: ['./nomination-status-tag.component.less'],
})
export class NominationStatusTagComponent implements OnInit {
    @Input() status: NominationStatus;
    nominationStatus = NominationStatus;

    constructor() {}

    ngOnInit() {}
}
