import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-lease-contracts-page',
    templateUrl: './lease-contracts-page.component.html',
    styleUrls: ['./lease-contracts-page.component.less'],
})
export class LeaseContractsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewLeaseContract(contractId: number) {
        if (!contractId) {
            this.logger.warn('Tried to view an Lease Contract without an leaseContract id');
            return;
        }
        this.router.navigate(['/home', 'contracts', 'view', contractId]);
    }

    onCreateLeaseContract() {}
}
