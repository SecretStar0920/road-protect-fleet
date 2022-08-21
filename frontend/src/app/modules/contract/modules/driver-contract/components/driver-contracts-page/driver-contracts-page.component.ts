import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-driver-contracts-page',
    templateUrl: './driver-contracts-page.component.html',
    styleUrls: ['./driver-contracts-page.component.less'],
})
export class DriverContractsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewDriverContract(contractId: number) {
        if (!contractId) {
            this.logger.warn('Tried to view an Driver Contract without an DriverContract id');
            return;
        }
        this.router.navigate(['/home', 'contracts', 'view', contractId]);
    }

    onCreateDriverContract() {}
}
