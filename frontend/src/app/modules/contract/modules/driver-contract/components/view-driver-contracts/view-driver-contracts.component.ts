import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { DriverContract } from '@modules/shared/models/entities/contract.model';
import { select, Store } from '@ngrx/store';
import * as contractSelectors from '@modules/contract/ngrx/contract.selectors';
import { ContractState } from '@modules/contract/ngrx/contract.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';
import { DriverContractService } from '@modules/contract/modules/driver-contract/services/driver-contract.service';

@Component({
    selector: 'rp-view-driver-contracts',
    templateUrl: './view-driver-contracts.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-driver-contracts.component.less'],
})
export class ViewDriverContractsComponent implements OnInit, OnDestroy {
    driverContracts: DriverContract[];
    getDriverContractsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(
        private driverContractService: DriverContractService,
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
        this.getDriverContracts();
    }

    getDriverContracts() {
        this.getDriverContractsState.submit();
        this.driverContractService.getAllDriverContracts().subscribe(
            (result) => {
                this.getDriverContractsState.onSuccess(i18next.t('view-driver-contracts.success'), result);
            },
            (error) => {
                this.getDriverContractsState.onFailure(i18next.t('view-driver-contracts.fail'), error.error);
            },
        );
        this.store.pipe(select(contractSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.driverContracts = result as DriverContract[];
            this.table.data = this.driverContracts.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
