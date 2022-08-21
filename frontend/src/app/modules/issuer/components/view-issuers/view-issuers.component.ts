import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { IssuerService } from '@modules/issuer/services/issuer.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { select, Store } from '@ngrx/store';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-issuers',
    templateUrl: './view-issuers.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-issuers.component.less'],
})
export class ViewIssuersComponent implements OnInit, OnDestroy {
    issuers: Issuer[];
    getIssuersState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(private issuerService: IssuerService, public table: GeneralTableService, private store: Store<IssuerState>) {
        this.table.options.primaryColumnKey = 'issuerId';
        this.table.options.enableRowSelect = false;
        this.table.options.export = {
            enabled: true,
            entity: 'Issuer',
        };
        this.table.customColumns = [
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
                key: 'externalPaymentLink',
                title: i18next.t('issuer.externalPaymentLink'),
            },
            {
                key: 'redirectionEmail',
                title: i18next.t('issuer.redirectionEmail'),
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getIssuers();
    }

    getIssuers() {
        this.getIssuersState.submit();
        this.issuerService.getAllIssuers().subscribe(
            (result) => {
                this.getIssuersState.onSuccess(i18next.t('view-issuers.success'), result);
            },
            (error) => {
                this.getIssuersState.onFailure(i18next.t('view-issuers.fail'), error.error);
            },
        );
        this.store.pipe(select(issuerNgrxHelper.entitySelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.issuers = result;
            this.table.data = this.issuers.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
