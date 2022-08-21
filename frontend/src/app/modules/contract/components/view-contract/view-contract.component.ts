import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { contractNgrxHelper, ContractState } from '@modules/contract/ngrx/contract.reducer';
import { select, Store } from '@ngrx/store';
import { Contract, ContractType, DriverContract, LeaseContract, OwnershipContract } from '@modules/shared/models/entities/contract.model';
import { NGXLogger } from 'ngx-logger';
import { ContractService } from '@modules/contract/services/contract.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-contract',
    templateUrl: './view-contract.component.html',
    styleUrls: ['./view-contract.component.less'],
})
export class ViewContractComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() contractId: number;

    contract: Contract;

    updateContractState: ElementStateModel<Contract> = new ElementStateModel();
    contractOcrState: ElementStateModel<Contract> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Contract>> = new EventEmitter();

    private destroy$ = new Subject();

    @Input() isCard: boolean = true;
    updateContractDatesVisible: boolean = false;

    contractTypes = ContractType;

    constructor(private store: Store<ContractState>, private logger: NGXLogger, private contractService: ContractService) {}

    ngOnInit() {
        this.getContract();
    }
    getContract() {
        this.logger.debug('Getting contract');
        this.store
            .pipe(
                select(contractNgrxHelper.selectEntityById(this.contractId)),
                takeUntil(this.destroy$),
                mergeMap((contract) => {
                    if (!contract) {
                        this.logger.debug('Contract not found on store, querying for it');
                        return this.contractService.getContract(this.contractId);
                    }
                    return of(contract);
                }),
            )
            .subscribe((result) => {
                this.contract = plainToClass(Contract, result);
            });
        return this.contract;
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
        this.updateContractDatesVisible = false;
    }

    onUpdateComplete(state: ElementStateModel<Contract>) {
        this.onUpdate();
        this.getContract();
        this.updateContractState = state;
    }

    onDelete(deleteState: ElementStateModel<Contract>) {
        this.destroy$.next();
        if (deleteState.hasSucceeded()) {
            this.delete.emit(deleteState);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onUpdateContract() {
        this.updateContractDatesVisible = true;
    }

    asLeaseContract(): LeaseContract {
        return this.contract as LeaseContract;
    }

    asOwnershipContract(): OwnershipContract {
        return this.contract as OwnershipContract;
    }

    asDriverContract(): DriverContract {
        return this.contract as DriverContract;
    }

    onDocumentDelete() {
        this.contractService
            .getContract(this.contractId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.contract = result;
            });
    }

    runOCR() {
        this.contractOcrState.submit();
        this.contractService
            .runContractOcr(this.contractId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.contract = result;
                    this.contractOcrState.onSuccess(i18next.t('update-contract-dates.success'));
                },
                (error) => {
                    this.contractOcrState.onFailure(i18next.t('update-contract-dates.fail'));
                },
            );
    }
}
