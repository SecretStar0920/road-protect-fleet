import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OwnershipContract } from '@modules/shared/models/entities/contract.model';
import { NGXLogger } from 'ngx-logger';
import { OwnershipContractService } from '@modules/contract/modules/ownership-contract/services/ownership-contract.service';
import { Subject } from 'rxjs';
import { ContractState } from '@modules/contract/ngrx/contract.reducer';

@Component({
    selector: 'rp-view-ownership-contract',
    templateUrl: './view-ownership-contract.component.html',
    styleUrls: ['./view-ownership-contract.component.less'],
})
export class ViewOwnershipContractComponent implements OnInit, OnDestroy {
    @Input() ownershipContract: OwnershipContract;

    private destroy$ = new Subject();

    constructor(
        private store: Store<ContractState>,
        private logger: NGXLogger,
        private ownershipContractService: OwnershipContractService,
    ) {}

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
