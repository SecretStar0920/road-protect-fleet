import { Component, OnInit, ViewChild } from '@angular/core';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import i18next from 'i18next';
import { PartialInfringementOcrService } from '@modules/admin-partial-infringement/services/partial-infringement-ocr.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { UploadOcrPartialInfringementDto } from '@modules/admin-partial-infringement/services/upload-ocr-partial-infringement.dto';
import { ViewOcrPartialInfringementsComponent } from '@modules/admin-partial-infringement/components/view-ocr-partial-infringements/view-ocr-partial-infringements.component';

interface PartialInfringementOCRUpload {
    issuer: Issuer,
    totalDocuments: number,
    isCompleteList: boolean,
    partialInfringementsFile: File
    hasSelectedFile: boolean,
    isUploading: boolean,
    hasUploaded: boolean,
    partialInfringements: PartialInfringement[]
}

@Component({
    selector: 'rp-upload-ocr-partial-infringement-page',
    templateUrl: './upload-ocr-partial-infringement-page.component.html',
    styleUrls: ['./upload-ocr-partial-infringement-page.component.less'],
})
export class UploadOcrPartialInfringementPageComponent implements OnInit {

    private destroy$ = new Subject();

    stepper: Stepper;
    data: PartialInfringementOCRUpload;

    uploadProgress = {
        valid: 0,
        invalid: 0,
        total: 0,
    };

    @ViewChild("viewOcrPartialInfringements") partialInfringementsComponent: ViewOcrPartialInfringementsComponent

    constructor(
        private partialInfringementOcrService: PartialInfringementOcrService,
        private socket: Socket
    ) {}

    ngOnInit() {
        this.data = {
            issuer: null,
            totalDocuments: 0,
            isCompleteList: false,
            partialInfringementsFile: null,
            hasSelectedFile: false,
            isUploading: false,
            hasUploaded: false,
            partialInfringements: [],
        };

        this.stepper = new Stepper<PartialInfringementOCRUpload>([
            new Step({
                title: i18next.t('upload-ocr-partial-infringement-page.select_issuer_step.title'),
                description: i18next.t('upload-ocr-partial-infringement-page.select_issuer_step.description'),
                validatorFunction: (data) => {
                    return !!data.issuer && data.totalDocuments > 0
                },
            }),
            new Step({
                title: i18next.t('upload-ocr-partial-infringement-page.upload_file_step.title'),
                description: i18next.t('upload-ocr-partial-infringement-page.upload_file_step.description'),
                validatorFunction: (data) => data.hasUploaded,
            }),

            new Step({
                title: i18next.t('upload-ocr-partial-infringement-page.view_infringements_step.title'),
                description: i18next.t('upload-ocr-partial-infringement-page.view_infringements_step.description'),
                showControlsFunction: (data) => false
            }),
        ]);

        this.stepper.data = this.data;
        this.listenToSocketProgress();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
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
                } else if (result.type === 'progress') {
                    this.uploadProgress = result.counts;
                } else if (result.type === 'end') {}
            });
    }

    /* Handle file selection */
    onFileSelected(ocrFile: File) {
        this.data.partialInfringementsFile = ocrFile;
        this.data.hasSelectedFile = !!ocrFile;
    }

    /**
     * Actions
     */
    onSelectIssuer(issuer) {
        this.data.issuer = issuer;
    }

    onUpload() {
        const file = this.data.partialInfringementsFile;
        if (!file) {
            return;
        }

        this.data.isUploading = true;

        const uploadDto = new UploadOcrPartialInfringementDto();
        uploadDto.issuerName = this.data.issuer.name;
        uploadDto.documentsNumber = this.data.totalDocuments;
        uploadDto.isCompleteList = this.data.isCompleteList;

        this.partialInfringementOcrService.upload(uploadDto, file)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                    this.data.partialInfringements = result.valid
                    this.data.isUploading = false
                    this.data.hasUploaded = true

                    this.partialInfringementsComponent.updateInfringements(result.valid)
                    this.stepper.next()
                },
                (error) => {
                    this.data.isUploading = false
                });
    }

    /**
     * Upload Progress
     */
    getProgressPercentage(): number {
        if (this.uploadProgress.total <= 0) {
            return 0;
        }

        return Math.round(((this.uploadProgress.valid + this.uploadProgress.invalid) / this.uploadProgress.total) * 100);
    }

    getSuccessPercentage() {
        if (this.uploadProgress.total <= 0) {
            return 0;
        }

        return Math.round((this.uploadProgress.valid / this.uploadProgress.total) * 100);
    }

    /**
     * Total documents
     */

    get totalDocuments(): number {
        return this.data.totalDocuments
    }

    set totalDocuments(value) {
        this.data.totalDocuments = Math.max(0, value)
    }

    get isCompleteList(): boolean {
        return this.data.isCompleteList
    }

    set isCompleteList(value) {
        this.data.isCompleteList = value
    }

}
