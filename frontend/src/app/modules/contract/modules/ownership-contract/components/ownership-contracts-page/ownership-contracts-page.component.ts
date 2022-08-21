import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-ownership-contracts-page',
    templateUrl: './ownership-contracts-page.component.html',
    styleUrls: ['./ownership-contracts-page.component.less'],
})
export class OwnershipContractsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewOwnershipContract(contractId: number) {
        if (!contractId) {
            this.logger.warn('Tried to view an Ownership Contract without an ownershipContract id');
            return;
        }
        this.router.navigate(['/home', 'contracts', 'view', contractId]);
    }

    onCreateOwnershipContract() {}
}
