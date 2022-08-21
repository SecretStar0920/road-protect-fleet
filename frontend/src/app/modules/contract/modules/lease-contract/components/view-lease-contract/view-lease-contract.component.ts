import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LeaseContract } from '@modules/shared/models/entities/contract.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-view-lease-contract',
    templateUrl: './view-lease-contract.component.html',
    styleUrls: ['./view-lease-contract.component.less'],
})
export class ViewLeaseContractComponent implements OnInit, OnDestroy {
    @Input() leaseContract: LeaseContract;

    private destroy$ = new Subject();

    constructor() {}

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
