import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DriverContract } from '@modules/shared/models/entities/contract.model';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { ContractState } from '@modules/contract/ngrx/contract.reducer';
import { DriverContractService } from '@modules/contract/modules/driver-contract/services/driver-contract.service';

@Component({
    selector: 'rp-view-driver-contract',
    templateUrl: './view-driver-contract.component.html',
    styleUrls: ['./view-driver-contract.component.less'],
})
export class ViewDriverContractComponent implements OnInit, OnDestroy {
    @Input() driverContract: DriverContract;

    private destroy$ = new Subject();

    constructor(private store: Store<ContractState>, private logger: NGXLogger, private driverContractService: DriverContractService) {}

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
