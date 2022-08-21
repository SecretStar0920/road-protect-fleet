import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Issuer, IssuerType } from '@modules/shared/models/entities/issuer.model';
import { select, Store } from '@ngrx/store';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { of, Subject } from 'rxjs';
import { CreateIssuerModalComponent } from '@modules/issuer/components/create-issuer/create-issuer-modal/create-issuer-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { IssuerQueryService } from '@modules/issuer/services/issuer-query.service';
import { FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import i18next from 'i18next';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Account } from '@modules/shared/models/entities/account.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { RequestInformationLogService } from '@modules/admin-log/request-information-log/services/request-information-log.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';
import { get, isEmpty } from 'lodash';
import { AuthState, currentAccount } from '@modules/auth/ngrx/auth.reducer';
import { AccountService } from '@modules/account/services/account.service';
import { setTableView } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { AdvancedTableNameEnum } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { UpdateIssuerComponent } from '@modules/issuer/components/update-issuer/update-issuer.component';

@Component({
    selector: 'rp-view-issuers-advanced',
    templateUrl: './view-issuers-advanced.component.html',
    providers: [AdvancedFilterTableService, AdvancedQueryFilterService, { provide: ApiQueryService, useClass: IssuerQueryService }],
    styleUrls: ['./view-issuers-advanced.component.less'],
})
export class ViewIssuersAdvancedComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('action', { static: true }) action: TemplateRef<any>;
    @ViewChild('delete', { static: true }) delete: TemplateRef<any>;

    createIssuerModal: NzModalRef<any>;
    editIssuerModal: NzModalRef<any>;
    currency = environment.currency;
    private destroy$ = new Subject();

    account: Account;
    selectedIssuers: Issuer[] = [];

    sendRequestInformationLogState: ElementStateModel<RequestInformationLog[]> = new ElementStateModel();

    constructor(
        protected table: AdvancedFilterTableService,
        protected query: AdvancedQueryFilterService,
        private store: Store<IssuerState>,
        private authStore: Store<AuthState>,
        private modalService: NzModalService,
        private logger: NGXLogger,
        private router: Router,
        private issuerService: IssuerService,
        private requestInformationLogService: RequestInformationLogService,
        private accountService: AccountService,
    ) {
        this.configureTable();

        this.getCurrentAccount();
    }

    private getCurrentAccount() {
        this.authStore
            .pipe(
                select(currentAccount),
                mergeMap((account) => {
                    if (isEmpty(account)) {
                        return this.accountService.getCurrentAccount();
                    } else {
                        return of(account);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((result) => {
                this.account = result;
            });
    }

    private configureTable() {
        // this.table.pageDataSelector = issuerSelectors.selectAll;
        this.store.dispatch(setTableView({ tableName: AdvancedTableNameEnum.issuerTable }));
        this.table.ngrxHelper = issuerNgrxHelper;
        this.table.options.primaryColumnKey = 'issuerId';
        // this.table.options.enableRowSelect = true;
        this.table.defaultColumns = [
            {
                key: 'name',
                title: i18next.t('issuer.name'),
            },
            {
                key: 'code',
                title: i18next.t('issuer.code'),
            },
            {
                key: 'type',
                title: i18next.t('issuer.type'),
            },
            {
                key: 'address',
                title: i18next.t('issuer.address'),
            },
            {
                key: 'email',
                title: i18next.t('issuer.email'),
            },
            {
                key: 'fax',
                title: i18next.t('issuer.fax'),
            },
            {
                key: 'telephone',
                title: i18next.t('issuer.telephone'),
            },
            {
                key: 'contactPerson',
                title: i18next.t('issuer.contact_person'),
            },
            {
                key: 'provider',
                title: i18next.t('issuer.provider'),
            },
            {
                key: 'authority.name',
                title: i18next.t('issuer.authority'),
            },
            {
                key: 'redirectionEmail',
                title: i18next.t('issuer.redirectionEmail'),
            },
            {
                key: 'externalPaymentLink',
                title: i18next.t('issuer.externalPaymentLink'),
            },
        ];

        this.query.filterKeys = [
            {
                key: 'name',
                display: i18next.t('issuer.name'),
                visibility: FilterKeyVisibility.Simple,
                enableSearch: true,
                searchEntity: 'issuer',
                searchField: 'name',
            },
            { key: 'code', display: i18next.t('issuer.code'), visibility: FilterKeyVisibility.Simple },
            { key: 'type', type: FilterKeyType.Dropdown, options: Object.values(IssuerType), display: i18next.t('issuer.type') },
            { key: 'address', display: i18next.t('issuer.address') },
            { key: 'email', display: i18next.t('issuer.email') },
            { key: 'fax', display: i18next.t('issuer.fax') },
            { key: 'telephone', display: i18next.t('issuer.telephone') },
            { key: 'contactPerson', display: i18next.t('issuer.contact_person') },
            { key: 'redirectionEmail', display: i18next.t('issuer.redirectionEmail') },
            { key: 'externalPaymentLink', display: i18next.t('issuer.externalPaymentLink') },
            { key: 'provider', display: i18next.t('issuer.provider'), visibility: FilterKeyVisibility.Simple },
            { key: 'authority.name', display: i18next.t('issuer.authority'), visibility: FilterKeyVisibility.Simple },
            // {
            //     key: 'latestInfoDate',
            //     type: FilterKeyType.Date,
            //     display: i18next.t('issuer.latestInfoDate'),
            //     visibility: FilterKeyVisibility.Detailed,
            // },
        ];
    }

    ngOnInit() {
        this.table.templateColumns = {
            // systemStatus: this.systemStatus,
        };
        if (this.action) {
            this.table.rowActionsTemplate = this.action;
        }
        if (this.delete) {
            this.table.rowDeleteTemplate = this.delete;
        }
        this.table.selectDataFromStore();

        this.store.pipe(select(issuerNgrxHelper.selectCurrentlySelectedRowData(), takeUntil(this.destroy$))).subscribe((result) => {
            this.selectedIssuers = result;
        });
    }

    ngAfterViewInit(): void {}

    onCreateIssuer() {
        this.createIssuerModal = this.modalService.create({
            nzTitle: i18next.t('view-issuer-advanced.create_issuer'),
            nzContent: CreateIssuerModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onViewIssuer(issuerId: number) {
        if (!issuerId) {
            this.logger.warn('Tried to view an Issuer without an issuer id');
            return;
        }
        // this.router.navigate(['/home', 'issuers', 'view', issuerId]);
        // Converts the route into a string that can be used with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree(['/home', 'issuers', 'view', issuerId]));
        window.open(url, '_blank');
    }

    onEditIssuer(issuer: Issuer) {
        this.editIssuerModal = this.modalService.create({
            nzTitle: i18next.t('view-issuer-advanced.edit_issuer'),
            nzContent: UpdateIssuerComponent,
            nzFooter: null,
            nzComponentParams: { issuer },
        });
        this.editIssuerModal.componentInstance.complete.subscribe((result) => {
            this.editIssuerModal.close();
        });
    }

    batchRequestInformation() {
        this.sendRequestInformationLogState.submit();
        this.requestInformationLogService
            .sendRequestForInformation(
                this.selectedIssuers.map((i) => {
                    return i.issuerId;
                }),
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated RequestInformationLog', result);
                    this.sendRequestInformationLogState.onSuccess(i18next.t('update-request-information-log.success'), result);
                },
                (error) => {
                    this.logger.error('Failed to update RequestInformationLog', error);
                    this.sendRequestInformationLogState.onFailure(i18next.t('update-request-information-log.fail'), error.error);
                },
            );
    }

    canSendRequest(): boolean {
        const accountHasPermission = get(this.account, 'requestInformationDetails.canSendRequest', false);
        const isLoading = this.sendRequestInformationLogState.isLoading();
        const issuersHaveEmailAddresses = this.selectedIssuers.some((issuerObject) => {
            return !!issuerObject.email;
        });
        return accountHasPermission && !isLoading && issuersHaveEmailAddresses;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
