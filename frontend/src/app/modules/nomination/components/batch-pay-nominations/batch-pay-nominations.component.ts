import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { Nomination, NominationStatus } from '@modules/shared/models/entities/nomination.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { some } from 'lodash';
import { getBatchPaymentResultData, isLoading } from '@modules/nomination/ngrx/nomination.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBatchPaymentResult, NominationService, PAYMENT_FLOW_DETAILS } from '@modules/nomination/services/nomination.service';
import { PayInfringementDetails } from '@modules/nomination/components/pay-nomination/pay-nomination.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { batchMunicipalPayNominationReq } from '@modules/nomination/ngrx/nomination.actions';
import { Infringement, InfringementStatus } from '@modules/shared/models/entities/infringement.model';

export class BatchPayInfringementDetails {
    payable: { [message: string]: PayInfringementDetails[] };
    payableIds: number[];
    amountPayable: string;
    notPayable: { [message: string]: PayInfringementDetails[] };
    notPayableIds: number[];
    amountNotPayable: string;
    paymentMethodsToBeUsed: { method: string; cardMask: string }[] = [];
}

@Component({
    selector: 'rp-batch-pay-nominations',
    templateUrl: './batch-pay-nominations.component.html',
    styleUrls: ['./batch-pay-nominations.component.less'],
})
export class BatchPayNominationsComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();
    isLoading$: Observable<boolean> = this.store.pipe(select(isLoading), takeUntil(this.destroy$));

    paymentFlowDetails = PAYMENT_FLOW_DETAILS;
    permissions = PERMISSIONS;

    private _infringements: Infringement[];
    get infringements(): Infringement[] {
        return this._infringements;
    }
    @Input()
    set infringements(value: Infringement[]) {
        this._infringements = value;
        this.payableInfringements = this._infringements.filter((n) =>
            some([InfringementStatus.ApprovedForPayment], (status) => status === n.status),
        );
    }

    payableInfringements: Infringement[];

    showPaymentDetailsModal: boolean;
    batchDetails: BatchPayInfringementDetails;

    cvvForm = new FormGroup({});

    showPaymentResultModel: boolean;
    batchPaymentResult: IBatchPaymentResult;

    constructor(
        private store: Store<AppState>,
        private nominationService: NominationService,
        private tableService: AdvancedFilterTableService,
    ) {}

    ngOnInit() {}

    onStartBatchPayment() {
        this.getGroupedPaymentDetails();
    }
    getGroupedPaymentDetails() {
        this.nominationService
            .getNominationPaymentDetailsBatch(this.payableInfringements.map((i) => i.nomination?.nominationId))
            .subscribe((result: BatchPayInfringementDetails) => {
                this.batchDetails = result;
                this.configureCvvForm();
                this.showPaymentDetailsModal = true;
            });
    }
    onPayAll() {
        this.store.dispatch(batchMunicipalPayNominationReq({ payableIds: this.batchDetails.payableIds, cvvValue: this.cvvForm.value }));
        this.store.pipe(select(getBatchPaymentResultData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!!result) {
                this.batchPaymentResult = result;
                this.showPaymentResultModel = true;
                this.showPaymentDetailsModal = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    private configureCvvForm() {
        this.cvvForm = new FormGroup({});
        this.batchDetails.paymentMethodsToBeUsed.forEach((method) => {
            this.cvvForm.addControl(method.method, new FormControl('', Validators.required));
        });
    }
}
