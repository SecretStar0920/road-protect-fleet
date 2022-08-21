import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BatchMunicipalRedirectionDetails } from '@modules/infringement/components/check-nomination-redirection-details/municipal-redirection.details';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { FailedRedirectSpreadsheetModel } from '@modules/shared/models/spreadsheet/failed-redirect-spreadsheet.model';
import { UnreadyRedirectSpreadsheetModel } from '@modules/shared/models/spreadsheet/unready-redirect-spreadsheet.model';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { ExportJsonToSheetService } from '@modules/shared/services/spreadsheet-service/export-json-to-sheet.service';
import { select, Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import i18next from 'i18next';
import { map, mapKeys, some } from 'lodash';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../../../ngrx/app.reducer';
import {
    NOMINATION_ACTION_MAP,
    NominationActions,
} from '@modules/nomination/components/view-nomination-actions/view-nomination-actions.component';
import { get } from 'lodash';
import { getBatchMunicipalRedirectionResultData } from '@modules/nomination/ngrx/nomination.selectors';
import { batchMunicipalRedirectNominationReq } from '@modules/nomination/ngrx/nomination.actions';

export interface ISuccessfulRedirectionResult {
    result: Nomination;
    nominationId: number;
}

export interface IFailedRedirectionResult {
    error: any;
    nominationId: number;
    result: Nomination;
}

export class IBatchRedirectionsResult {
    successfulRedirections: ISuccessfulRedirectionResult[];
    failedRedirections: IFailedRedirectionResult[];
}

@Component({
    selector: 'rp-batch-municipally-redirect-nominations',
    templateUrl: './batch-municipally-redirection-nominations.component.html',
    styleUrls: ['./batch-municipally-redirection-nominations.component.less'],
})
export class BatchMunicipallyRedirectionNominationsComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();

    permissions = PERMISSIONS;

    private _infringements: Infringement[];
    get infringements(): Infringement[] {
        return this._infringements;
    }

    @Input()
    set infringements(value: Infringement[]) {
        this._infringements = value;
        this.initialise();
    }

    filteredInfringements: Infringement[] = [];

    modalVisible: boolean = false;

    stepper: Stepper<any> = new Stepper<any>([
        new Step({ title: i18next.t('batch-municipally-redirect-nominations.detail_check') }),
        new Step({ title: i18next.t('batch-municipally-redirect-nominations.redirect_progress') }),
        new Step({ title: i18next.t('batch-municipally-redirect-nominations.results') }),
    ]);

    //////////////////////////////////////////////////////////////////
    // Phase 1 - details
    //////////////////////////////////////////////////////////////////
    getDetailsLoadingState = new ElementStateModel();
    batchRedirectionDetails: BatchMunicipalRedirectionDetails;

    //////////////////////////////////////////////////////////////////
    // Phase 2 - redirect
    //////////////////////////////////////////////////////////////////
    batchRedirectLoadingState = new ElementStateModel();
    batchProgress: { total: number; successful: number; failed: number } = { total: 1, failed: 0, successful: 0 };
    batchProgressPercent = 0;
    batchRedirectionResult: IBatchRedirectionsResult;

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private infringementService: InfringementService,
        private nominationService: NominationService,
        private socket: Socket,
        private spreadsheetService: ExportJsonToSheetService,
    ) {}

    ngOnInit() {}

    initialise() {
        this.getDetailsLoadingState = new ElementStateModel();
        this.batchRedirectLoadingState = new ElementStateModel();
        this.batchProgress = { total: 1, failed: 0, successful: 0 };
        this.filterRedirectableInfringements();
    }

    filterRedirectableInfringements() {
        this.filteredInfringements = (this.infringements || []).filter((inf) => {
            const nominationStatus = get(inf, 'nomination.status');
            const requiredStatuses = NOMINATION_ACTION_MAP[NominationActions.Redirect];
            return some(requiredStatuses, (status) => status === nominationStatus);
        });
    }

    onClickBatchRedirect() {
        this.getBatchRedirectionDetails();
    }

    getBatchRedirectionDetails() {
        this.getDetailsLoadingState.submit();
        this.stepper.toStep(1);
        this.infringementService.getBatchRedirectionDetails(this.filteredInfringements.map((n) => n.infringementId)).subscribe(
            (result) => {
                this.getDetailsLoadingState.onSuccess();
                this.batchRedirectionDetails = result;
                this.modalVisible = true;
            },
            (error) => {
                this.getDetailsLoadingState.onFailure(error.message);
            },
        );
    }

    batchRedirectConfirm() {
        this.store.dispatch(
            batchMunicipalRedirectNominationReq({
                nominationsIds: this.batchRedirectionDetails.ready.redirections.map((n) => n.nomination.nominationId),
            }),
        );

        this.batchRedirectLoadingState.submit();
        this.stepper.next();
        this.socket
            .fromEvent('batch-municipal-redirection')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: { total: number; successful: number; failed: number }) => {
                this.batchProgress = result;
                this.batchProgressPercent = Math.round(((result.successful + result.failed) / result.total) * 100);
            });

        this.store.pipe(select(getBatchMunicipalRedirectionResultData), takeUntil(this.destroy$)).subscribe(
            (result) => {
                if (result.failedRedirections.length > 0 || result.successfulRedirections.length > 0) {
                    this.batchRedirectionResult = result;
                    this.batchRedirectLoadingState.onSuccess();
                    this.stepper.next();
                }
            },
            (error) => {
                this.batchRedirectLoadingState.onFailure(error.message);
            },
        );
    }

    downloadUnreadyRedirects() {
        const rawData: UnreadyRedirectSpreadsheetModel[] = plainToClass(
            UnreadyRedirectSpreadsheetModel,
            this.batchRedirectionDetails.unready.redirections,
            { excludeExtraneousValues: true },
        );
        const translationKey = 'unready-batch-redirects-spreadsheet';
        const filename = i18next.t(`${translationKey}.workbook_name`);
        const sheetName = i18next.t(`${translationKey}.sheet_name`);

        // For every record in the array, translate the keys of the record correctly
        const translatedData = map(rawData, (record: UnreadyRedirectSpreadsheetModel) => {
            return mapKeys(record, (value, key) => i18next.t(`${translationKey}.${key}_heading`));
        });
        this.spreadsheetService.writeDataToFile(translatedData, sheetName, filename);
    }

    downloadFailedRedirects() {
        if (!this.batchRedirectionResult || !this.batchRedirectionResult.failedRedirections) {
            return;
        }

        // Flatten the object to make it easier to transform
        const mappedFailedRedirections = map(this.batchRedirectionResult.failedRedirections, (redirection) => {
            return {
                ...redirection,
                ...redirection.result,
            };
        });

        // Plain to class to get right data model
        const rawData: FailedRedirectSpreadsheetModel[] = plainToClass(FailedRedirectSpreadsheetModel, mappedFailedRedirections, {
            excludeExtraneousValues: true,
        });
        const translationKey = 'failed-batch-redirects-spreadsheet';

        const filename = i18next.t(`${translationKey}.workbook_name`);
        const sheetName = i18next.t(`${translationKey}.sheet_name`);

        // For every record in the array, translate the keys of the record correctly
        const translatedData = map(rawData, (record: FailedRedirectSpreadsheetModel) => {
            return mapKeys(record, (value, key) => i18next.t(`${translationKey}.${key}_heading`));
        });
        this.spreadsheetService.writeDataToFile(translatedData, sheetName, filename);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onCancel() {
        this.modalVisible = false;
    }
}
