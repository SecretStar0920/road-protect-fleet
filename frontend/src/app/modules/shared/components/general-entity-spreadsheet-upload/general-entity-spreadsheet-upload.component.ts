import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { GeneralSpreadsheetUploadComponent } from '@modules/shared/components/general-spreadsheet-upload/general-spreadsheet-upload.component';
import { Entity } from '@modules/shared/models/timestamped';
import { EntitySpreadsheetUpload } from '@modules/shared/models/entity-spreadsheet.upload';
import * as xlsx from 'xlsx';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/models/spreadsheet-upload-complete.response';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';
import { CookieService } from 'ngx-cookie-service';
import { FileUploadData } from '@modules/infringement/ngrx/file-upload-data.interface';

@Component({
    selector: 'rp-general-entity-spreadsheet-upload',
    templateUrl: './general-entity-spreadsheet-upload.component.html',
    styleUrls: ['./general-entity-spreadsheet-upload.component.less'],
})
export class GeneralEntitySpreadsheetUploadComponent implements OnInit, OnDestroy {
    stepper: Stepper;

    @Input() entitySpreadsheetUpload: EntitySpreadsheetUpload<Entity>;

    // States
    verifyState: ElementStateModel = new ElementStateModel();
    uploadState: ElementStateModel = new ElementStateModel();

    // Verify data
    verifyResult: SpreadsheetUploadCompleteResponse;
    onVerifyResult = new EventEmitter<SpreadsheetUploadCompleteResponse>();

    // Upload data
    hasStarted: boolean = false;
    uploadProgress: { valid: number; invalid: number; total: number } = {
        valid: 0,
        invalid: 0,
        total: 0,
    };
    uploadResult: SpreadsheetUploadCompleteResponse;
    onUploadResult = new EventEmitter<SpreadsheetUploadCompleteResponse>();

    protected additionalParameters: any = {};

    // View Children
    @ViewChild('generalSpreadsheetUpload') generalSpreadsheetUpload: GeneralSpreadsheetUploadComponent;
    private destroy$ = new Subject();

    constructor(protected socket: Socket, protected cookieService: CookieService) {}

    ngOnInit() {
        this.stepper = new Stepper([
            new Step({
                title: i18next.t('general-entity-spreadsheet-upload.select_method'),
                description: i18next.t('general-entity-spreadsheet-upload.select'),
            }),
            new Step({
                title: i18next.t('general-entity-spreadsheet-upload.select_sheet'),
                description: i18next.t('general-entity-spreadsheet-upload.select_sheet_desc'),
                validatorFunction: (data) => {
                    return data.fileSelected;
                },
            }),
            new Step({
                title: i18next.t('general-entity-spreadsheet-upload.verify'),
                description: i18next.t('general-entity-spreadsheet-upload.verify_desc'),
            }),
            new Step({
                title: i18next.t('general-entity-spreadsheet-upload.upload'),
                description: i18next.t('general-entity-spreadsheet-upload.upload_desc_' + this.entitySpreadsheetUpload.entityName),
            }),
        ]);
        this.stepper.data = { fileSelected: false };
        this.listenToSocketProgress();
    }

    /* Checks for data in the uploaded file */
    checkContentsOfUploadedFile(uploadedFile: FileUploadData) {
        if (uploadedFile.sheetHeadings?.length > 0) {
            this.stepper.data.fileSelected = true;
        } else {
            this.stepper.data.fileSelected = false;
        }
    }
    /* Disables the next button when file is removed from queue */
    checkIfFileIsOnQueue(isFileOnQueue: boolean) {
        if (!isFileOnQueue) {
            this.stepper.data.fileSelected = isFileOnQueue;
        }
    }
    onVerify() {
        const { file, data, headingMap, additionalParameters } = this.getData();
        if (!file || !data || !headingMap) {
            return;
        }
        this.verifyState.submit();
        this.entitySpreadsheetUpload.currentOption.service
            .verify(file, {
                headingMap,
                method: this.entitySpreadsheetUpload.currentMethod,
                additionalParameters,
            })
            .subscribe(
                (response) => {
                    this.verifyResult = response;
                    this.onVerifyResult.emit(this.verifyResult);
                    this.verifyState.onSuccess(i18next.t('general-entity-spreadsheet-upload.success'));
                },
                (error) => {
                    this.verifyState.onFailure(i18next.t('general-entity-spreadsheet-upload.fail'), error);
                },
            );
    }

    /**
     * Uploads spreadsheet to be processed, response is sent via socket
     */
    onUpload() {
        const { file, data, headingMap, additionalParameters } = this.getData();
        if (!file || !data || !headingMap) {
            return;
        }
        this.uploadState.submit();
        this.entitySpreadsheetUpload.currentOption.service
            .uploadSocket(file, {
                headingMap,
                additionalParameters,
                method: this.entitySpreadsheetUpload.currentMethod,
            })
            .subscribe(
                () => {},
                (error) => {
                    this.uploadState.onFailure(i18next.t('general-entity-spreadsheet-upload.fail_upload'), error);
                },
            );
    }

    /**
     * Sets up the listener for upload progress and results
     */
    protected listenToSocketProgress() {
        this.socket
            .fromEvent('upload')
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                if (result.type === 'start') {
                    this.hasStarted = true;
                } else if (result.type === 'progress') {
                    this.hasStarted = true;
                    this.uploadProgress = result.counts;
                } else if (result.type === 'end') {
                    this.uploadState.onSuccess(
                        `${i18next.t('general-entity-spreadsheet-upload.uploaded')} ${result.result.validCount} ${i18next.t(
                            'general-entity-spreadsheet-upload.of',
                        )} ${result.result.invalidCount} ${i18next.t('general-entity-spreadsheet-upload.items_failed')}`,
                    );
                    this.uploadResult = result.result;
                    this.onUploadResult.emit(this.uploadResult);
                    this.hasStarted = false;
                }
            });
    }

    private getData() {
        const file = this.generalSpreadsheetUpload.getFile();
        const data = this.generalSpreadsheetUpload.getData();
        const headingMap = this.generalSpreadsheetUpload.getHeadingMap();
        const additionalParameters = this.additionalParameters;

        additionalParameters.timezone = this.cookieService.get('timezone');

        return { file, data, headingMap, additionalParameters };
    }

    onDownloadTemplate() {
        const workbook = xlsx.utils.book_new();
        const headings = this.entitySpreadsheetUpload.currentOption.spreadsheetHeadings;
        const worksheet = xlsx.utils.aoa_to_sheet([headings]);
        xlsx.utils.book_append_sheet(workbook, worksheet, this.entitySpreadsheetUpload.entityName);
        xlsx.writeFile(
            workbook,
            `${this.entitySpreadsheetUpload.entityName.toLowerCase()}-${this.entitySpreadsheetUpload.currentMethod.toLowerCase()}-template.xlsx`,
        );
    }

    getProgressPercentage() {
        return Math.round(((this.uploadProgress.valid + this.uploadProgress.invalid) / this.uploadProgress.total) * 10 * 10);
    }

    getSuccessPercentage() {
        return Math.round((this.uploadProgress.valid / this.uploadProgress.total) * 10 * 10);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
