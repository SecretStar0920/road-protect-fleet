import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { LeaseContractService } from '@modules/contract/modules/lease-contract/services/lease-contract.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { LeaseContract } from '@modules/shared/models/entities/contract.model';
import { select, Store } from '@ngrx/store';
import * as contractSelectors from '@modules/contract/ngrx/contract.selectors';
import { ContractState } from '@modules/contract/ngrx/contract.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-lease-contracts',
    templateUrl: './view-lease-contracts.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-lease-contracts.component.less'],
})
export class ViewLeaseContractsComponent implements OnInit, OnDestroy {
    leaseContracts: LeaseContract[];
    getLeaseContractsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(
        private leaseContractService: LeaseContractService,
        public table: GeneralTableService,
        private store: Store<ContractState>,
    ) {
        this.table.options.primaryColumnKey = 'contractId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
            {
                key: 'contractId',
                title: 'id',
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getLeaseContracts();
    }

    getLeaseContracts() {
        this.getLeaseContractsState.submit();
        this.leaseContractService.getAllLeaseContracts().subscribe(
            (result) => {
                this.getLeaseContractsState.onSuccess(i18next.t('view-lease-contracts.success'), result);
            },
            (error) => {
                this.getLeaseContractsState.onFailure(i18next.t('view-lease-contracts.fail'), error.error);
            },
        );
        this.store.pipe(select(contractSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.leaseContracts = result as LeaseContract[];
            this.table.data = this.leaseContracts.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
