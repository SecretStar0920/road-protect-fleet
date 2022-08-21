import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { PaymentService } from '@modules/payment/services/payment.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { select, Store } from '@ngrx/store';
import * as paymentSelectors from '@modules/payment/ngrx/payment.selectors';
import { PaymentState } from '@modules/payment/ngrx/payment.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-payments',
    templateUrl: './view-payments.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-payments.component.less'],
})
export class ViewPaymentsComponent implements OnInit, OnDestroy {
    payments: Payment[];
    getPaymentsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(private paymentService: PaymentService, public table: GeneralTableService, private store: Store<PaymentState>) {
        this.table.options.primaryColumnKey = 'paymentId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
            {
                key: 'paymentId',
                title: 'id',
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getPayments();
    }

    getPayments() {
        this.getPaymentsState.submit();
        this.paymentService.getAllPayments().subscribe(
            (result) => {
                this.getPaymentsState.onSuccess(i18next.t('view-payments.success'), result);
            },
            (error) => {
                this.getPaymentsState.onFailure(i18next.t('view-payments.fail'), error.error);
            },
        );
        this.store.pipe(select(paymentSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.payments = result;
            this.table.data = this.payments.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
