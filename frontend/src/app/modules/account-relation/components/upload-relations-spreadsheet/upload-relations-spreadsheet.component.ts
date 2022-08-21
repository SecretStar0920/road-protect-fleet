import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FileItem } from 'ng2-file-upload';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';

@Component({
    selector: 'rp-upload-relations-spreadsheet',
    templateUrl: './upload-relations-spreadsheet.component.html',
    styleUrls: ['./upload-relations-spreadsheet.component.less'],
})
export class UploadRelationsSpreadsheet implements OnInit, OnDestroy {
    mimeTypes = MIME_TYPES;
    files: FileItem[] = [];
    loading = false;

    uploadState: ElementStateModel<AccountRelation[]> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    private destroy$ = new Subject();
    customFields: { [key: string]: string } = {};

    constructor(
        private relationService: AccountRelationApiService
    ) {}

    ngOnInit() {

    }

    onFilesChanged(files: FileItem[]) {
        this.files = files
    }

    onUpload() {
        if (this.loading || this.files.length < 1) {
            return
        }

        const file = this.files[0];

        this.loading = true
        this.relationService.generateAccountRelationFromSpreadsheet(file._file)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                    this.loading = false
                    this.uploadState.onSuccess('Successfully generated Account Relations', result);
                    this.complete.emit(this.uploadState);
                },
                (error) => {
                    this.loading = false
                    this.uploadState.onFailure('Failed to create Account Relation', error.error);
                    this.complete.emit(this.uploadState);
                },)

    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
