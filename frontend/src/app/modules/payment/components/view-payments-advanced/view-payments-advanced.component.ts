import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { paymentNgrxHelper, PaymentState } from '@modules/payment/ngrx/payment.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { CreatePaymentModalComponent } from '@modules/payment/components/create-payment/create-payment-modal/create-payment-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { PaymentQueryService } from '@modules/payment/services/payment-query.service';
import { Payment } from '@modules/shared/models/entities/payment.model';
import i18next from 'i18next';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

@Component({
    selector: 'rp-view-payments-advanced',
    templateUrl: './view-payments-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: PaymentQueryService }],
    styleUrls: ['./view-payments-advanced.component.less'],
})
export class ViewPaymentsAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    payments: Payment[];
    getPaymentsState: ElementStateModel = new ElementStateModel();
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;
    createPaymentModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    constructor(
        private paymentQueryService: PaymentQueryService,
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<PaymentState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
    ) {
        this.configureTable();
    }

    private configureTable() {
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.paymentsTable }));
        this.table.ngrxHelper = paymentNgrxHelper;
        this.table.options.primaryColumnKey = 'paymentId';
        this.table.options.enableRowSelect = true;
        this.table.defaultColumns = [
            {
                key: 'noticeNumber',
                title: i18next.t('view-payments-advanced.notice_number'),
            },
        ];

        this.query.filterKeys = [
            {
                key: 'noticeNumber',
            },
        ];
    }

    ngOnInit() {
        // this.getPayments();
        this.table.templateColumns = {
            // offenceDate: this.offenceDate,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }
        this.table.selectDataFromStore();
    }

    ngAfterViewInit(): void {}

    onCreatePayment() {
        this.createPaymentModal = this.modalService.create({
            nzTitle: i18next.t('view-payments-advanced.create_payment'),
            nzContent: CreatePaymentModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onViewPayment(paymentId: number) {
        if (!paymentId) {
            this.logger.warn('Tried to view an Payment without an payment id');
            return;
        }
        // this.router.navigate(['/home', 'payments', 'view', paymentId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'payments', 'view', paymentId]));
        window.open(url, '_blank');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
