import { Component, Input, OnInit } from '@angular/core';
import { InfringementApproval } from '@modules/shared/models/entities/infringement-approval.model';

@Component({
    selector: 'rp-view-infringement-approvals',
    templateUrl: './view-infringement-approvals.component.html',
    styleUrls: ['./view-infringement-approvals.component.less'],
})
export class ViewInfringementApprovalsComponent implements OnInit {
    @Input() infringementApprovals: InfringementApproval[];

    constructor() {}

    ngOnInit(): void {}
}
