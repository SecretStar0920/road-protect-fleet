import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import {
    adminInfringementUploadIssuer,
    adminInfringementUploadMissingInfringementLoading,
    adminInfringementUploadMissingInfringements,
    adminInfringementUploadMissingSkipRedirections,
} from '@modules/infringement/ngrx/infringement.selectors';
import { takeWhile } from 'rxjs/operators';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import i18next from 'i18next';
import { Observable } from 'rxjs';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { cloneDeep } from 'lodash';
import {
    redirectMissingInfringementsRequest,
    redirectMissingInfringementsSkipRedirections,
} from '@modules/infringement/ngrx/infringement.actions';
import { Issuer } from '@modules/shared/models/entities/issuer.model';

@Component({
    selector: 'rp-view-missing-upsert-infringements',
    templateUrl: './view-missing-upsert-infringements.component.html',
    styleUrls: ['./view-missing-upsert-infringements.component.less'],
    providers: [GeneralTableService],
})
export class ViewMissingUpsertInfringementsComponent implements OnInit {
    private alive = true;

    loading$: Observable<boolean>;
    skipRedirections$: Observable<boolean>;

    issuers$: Observable<Issuer[]>;

    missingInfringements: Infringement[] = [];

    constructor(private store$: Store<InfringementState>, public table: GeneralTableService) {}

    ngOnInit(): void {
        this.store$
            .select(adminInfringementUploadMissingInfringements)
            .pipe(takeWhile(() => this.alive))
            .subscribe((missingInfringements) => {
                this.missingInfringements = cloneDeep(missingInfringements);
                this.table.data = this.missingInfringements;
            });

        this.loading$ = this.store$.select(adminInfringementUploadMissingInfringementLoading).pipe(takeWhile(() => this.alive));
        this.skipRedirections$ = this.store$.select(adminInfringementUploadMissingSkipRedirections).pipe(takeWhile(() => this.alive));
        this.issuers$ = this.store$.select(adminInfringementUploadIssuer).pipe(takeWhile(() => this.alive));
        this.table.options.primaryColumnKey = 'infringementId';
        this.table.options.enableRowSelect = false;
        this.table.options.export = {
            enabled: false,
            entity: 'Infringement',
        };
        this.table.customColumns = [
            {
                key: 'noticeNumber',
                title: i18next.t('infringement.notice_number'),
            },
            {
                key: 'nomination.rawRedirectionIdentifier',
                title: i18next.t('infringement.redirection_identifier'),
            },
            {
                key: 'nomination.nominationDate',
                title: i18next.t('infringement.redirection_letter_send_date'),
            },
            {
                key: 'nomination.redirectedDate',
                title: i18next.t('infringement.redirection_completion_date'),
            },
            // Add other fields here
        ];
    }

    onRedirectList() {
        this.store$.dispatch(
            redirectMissingInfringementsRequest({
                infringementIds: this.missingInfringements.map((infringement) => infringement.infringementId),
            }),
        );
    }

    onSkipRedirections() {
        this.store$.dispatch(redirectMissingInfringementsSkipRedirections());
    }
}
