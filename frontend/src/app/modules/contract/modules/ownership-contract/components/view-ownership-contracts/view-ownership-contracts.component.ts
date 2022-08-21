import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { OwnershipContractService } from '@modules/contract/modules/ownership-contract/services/ownership-contract.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { OwnershipContract } from '@modules/shared/models/entities/contract.model';
import { select, Store } from '@ngrx/store';
import * as contractSelectors from '@modules/contract/ngrx/contract.selectors';
import { ContractState } from '@modules/contract/ngrx/contract.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-ownership-contracts',
    templateUrl: './view-ownership-contracts.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-ownership-contracts.component.less'],
})
export class ViewOwnershipContractsComponent implements OnInit, OnDestroy {
    ownershipContracts: OwnershipContract[];
    getOwnershipContractsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(
        private ownershipContractService: OwnershipContractService,
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
        this.getOwnershipContracts();
    }

    getOwnershipContracts() {
        this.getOwnershipContractsState.submit();
        this.ownershipContractService.getAllOwnershipContracts().subscribe(
            (result) => {
                this.getOwnershipContractsState.onSuccess(i18next.t('view-ownership-contracts.success'), result);
            },
            (error) => {
                this.getOwnershipContractsState.onFailure(i18next.t('view-ownership-contracts.fail'), error.error);
            },
        );
        this.store.pipe(select(contractSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.ownershipContracts = result as OwnershipContract[];
            this.table.data = this.ownershipContracts.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
