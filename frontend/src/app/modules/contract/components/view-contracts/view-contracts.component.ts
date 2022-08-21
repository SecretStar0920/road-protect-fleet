import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ContractService } from '@modules/contract/services/contract.service';
import { Contract, ContractType } from '@modules/shared/models/entities/contract.model';
import { select, Store } from '@ngrx/store';
import * as contractSelectors from '@modules/contract/ngrx/contract.selectors';
import { ContractState } from '@modules/contract/ngrx/contract.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateContractModalComponent } from '@modules/contract/components/create-contract/create-contract-modal/create-contract-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-contracts',
    templateUrl: './view-contracts.component.html',
    styleUrls: ['./view-contracts.component.less'],
})
export class ViewContractsComponent implements OnInit, OnDestroy {
    contracts: Contract[];
    getContractsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    @Input() vehicleId: number;

    createContractModal: NzModalRef<any>;

    constructor(private contractService: ContractService, private store: Store<ContractState>, private modalService: NzModalService) {}

    ngOnInit() {
        this.getContracts();
    }

    getContracts() {
        this.getContractsState.submit();
        this.contractService.getContractsForVehicle(this.vehicleId).subscribe(
            (result) => {
                this.getContractsState.onSuccess('Successfully retrieved Vehicle Contracts');
            },
            (error) => {
                this.getContractsState.onFailure('Failed to retrieve Vehicle Contracts', error.error);
            },
        );
        this.store.pipe(select(contractSelectors.getContractByVehicleId(this.vehicleId)), takeUntil(this.destroy$)).subscribe((result) => {
            this.contracts = result;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onCreateLeaseContract() {
        this.createContractModal = this.modalService.create({
            nzTitle: 'Add Vehicle Lease',
            nzContent: CreateContractModalComponent,
            nzFooter: null,
            nzComponentParams: {
                vehicleId: this.vehicleId,
                type: ContractType.Lease,
            },
        });
    }

    onCreateOwnershipContract() {
        this.createContractModal = this.modalService.create({
            nzTitle: 'Add Vehicle Ownership',
            nzContent: CreateContractModalComponent,
            nzFooter: null,
            nzComponentParams: {
                vehicleId: this.vehicleId,
                type: ContractType.Ownership,
            },
        });
    }
}
