import { Component, OnInit } from '@angular/core';
import { GeneralEntitySpreadsheetUploadComponent } from '@modules/shared/components/general-entity-spreadsheet-upload/general-entity-spreadsheet-upload.component';
import { Socket } from 'ngx-socket-io';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import i18next from 'i18next';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { Store } from '@ngrx/store';
import { InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import {
    adminInfringementUpload,
    adminInfringementUploadAccount,
    adminInfringementUploadIssuer,
} from '@modules/infringement/ngrx/infringement.selectors';
import { takeWhile } from 'rxjs/operators';
import {
    setAccountInAdminInfringementUpload,
    setFileInAdminInfringementUpload,
    setFileUploadDataInAdminInfringementUpload,
    setIssuersInAdminInfringementUpload,
    setUploadResponseInAdminInfringementUpload,
    setVerifyResponseInAdminInfringementUpload,
} from '@modules/infringement/ngrx/infringement.actions';
import { AdminInfringementUpload } from '@modules/infringement/ngrx/admin-infringement-upload.interface';
import { FileUploadData } from '@modules/infringement/ngrx/file-upload-data.interface';
import { CookieService } from 'ngx-cookie-service';
import { Account } from '@modules/shared/models/entities/account.model';

@Component({
    selector: 'rp-infringement-spreadsheet-upload',
    templateUrl: './infringement-spreadsheet-upload.component.html',
    styleUrls: ['./infringement-spreadsheet-upload.component.less'],
})
export class InfringementSpreadsheetUploadComponent extends GeneralEntitySpreadsheetUploadComponent implements OnInit {
    alive = true;
    onSelectIssuers = (issuers: Issuer[]) => this.store$.dispatch(setIssuersInAdminInfringementUpload({ issuers }));
    onSelectAccount = (account: Account) => this.store$.dispatch(setAccountInAdminInfringementUpload({ account }));
    onFilesSelected = (files: File[]) => this.store$.dispatch(setFileInAdminInfringementUpload({ files }));
    onFileUploadChange = (uploadData: FileUploadData) => this.store$.dispatch(setFileUploadDataInAdminInfringementUpload({ uploadData }));

    constructor(protected socket: Socket, private store$: Store<InfringementState>, protected cookieService: CookieService) {
        super(socket, cookieService);
    }

    ngOnInit(): void {
        this.stepper = new Stepper<AdminInfringementUpload>([
            new Step({
                title: i18next.t('infringement-spreadsheet-upload.select_issuer'),
                description: i18next.t('infringement-spreadsheet-upload.select_issuer_desc'),
            }),
            new Step({
                title: i18next.t('infringement-spreadsheet-upload.select_sheet'),
                description: i18next.t('infringement-spreadsheet-upload.select_sheet_desc'),
                validatorFunction: (data) => data.fileUpload.files.length > 0,
            }),
            new Step({
                title: i18next.t('infringement-spreadsheet-upload.verify'),
                description: i18next.t('infringement-spreadsheet-upload.verify_desc'),
                validatorFunction: (data) => !!data.verifyResponse,
            }),
            new Step({
                title: i18next.t('infringement-spreadsheet-upload.upload'),
                description: i18next.t('infringement-spreadsheet-upload.upload_desc'),
                validatorFunction: (data) => !!data.uploadResponse,
            }),
            new Step({
                title: i18next.t('infringement-spreadsheet-upload.view_missing'),
                description: i18next.t('infringement-spreadsheet-upload.view_missing_desc'),
                validatorFunction: (data) =>
                    !!data.missingInfringements.submitResponse ||
                    data.missingInfringements.skipRedirections ||
                    // @ts-ignore
                    (data.missingInfringements.submitResponse && !data.missingInfringements.submitResponse.missingInfringements.length) ||
                    data.issuers.length === 0,
            }),
            new Step({
                title: i18next.t('infringement-spreadsheet-upload.summary'),
                description: i18next.t('infringement-spreadsheet-upload.summary_desc'),
                showControlsFunction: (data) => false,
            }),
        ]);

        this.store$
            .select(adminInfringementUpload)
            .pipe(takeWhile(() => this.alive))
            .subscribe((uploadData) => (this.stepper.data = uploadData));
        this.store$
            .select(adminInfringementUploadIssuer)
            .pipe(takeWhile(() => this.alive))
            .subscribe((issuers) => (this.additionalParameters.issuerIds = issuers.map((issuer) => issuer.issuerId)));
        this.store$
            .select(adminInfringementUploadAccount)
            .pipe(takeWhile(() => this.alive))
            .subscribe((account) => (this.additionalParameters.accountId = account?.accountId));
        this.onVerifyResult
            .pipe(takeWhile(() => this.alive))
            .subscribe((response) => this.store$.dispatch(setVerifyResponseInAdminInfringementUpload({ response })));
        this.onUploadResult
            .pipe(takeWhile(() => this.alive))
            .subscribe((response) => this.store$.dispatch(setUploadResponseInAdminInfringementUpload({ response })));
        this.listenToSocketProgress();
    }
}
