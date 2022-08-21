import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';
import { FileItem } from 'ng2-file-upload';


@Component({
    selector: 'ocr-file-upload',
    templateUrl: './ocr-file-upload.component.html',
    styleUrls: ['./ocr-file-upload.component.less'],
})
export class OcrFileUploadComponent implements OnInit {
    mimeTypes = MIME_TYPES;

    ocrFile: File;
    files: File[] = [];

    @Output() onFilesSelected = new EventEmitter<File[]>();
    @Output() onUploadChange = new EventEmitter<File>();
    @Output() filesOnQueue = new EventEmitter<boolean>();
    constructor() {}

    ngOnInit() {}

    onFilesChanged(files: FileItem[]) {
        this.files = files.map((file) => file._file);

        if (files.length === 1) {
            this.files = files.map((file) => file._file);
            this.ocrFile = this.files[0];
            this.onFilesSelected.emit(this.files);
        } else {
            this.ocrFile = undefined;
        }

        this.emitUploadDataChange();
    }

    private emitUploadDataChange() {
        this.onUploadChange.emit(this.ocrFile);
    }

}
