import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DocumentService } from '@modules/document/services/document.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Document } from '@modules/shared/models/entities/document.model';
import { FileItem } from 'ng2-file-upload';
import i18next from 'i18next';
import { GeneralFileUploadComponent } from '@modules/shared/components/general-file-upload/general-file-upload.component';

@Component({
    selector: 'rp-create-document',
    templateUrl: './create-document.component.html',
    styleUrls: ['./create-document.component.less'],
})
export class CreateDocumentComponent implements OnInit {
    createDocumentForm: FormGroup;
    createDocumentState: ElementStateModel<Document> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();
    @Output() ocr: EventEmitter<Document> = new EventEmitter();

    @Input() mimeTypes: string[] = []; // @see MimeTypes
    @Input() performOCR: boolean = false; // Should OCR be performed?
    @Input() showSuccess: boolean = true; // Should the success message be shown?

    @ViewChild('fileUpload') fileUpload: GeneralFileUploadComponent;

    file: FileItem;

    get f() {
        return this.createDocumentForm.controls;
    }

    constructor(private documentService: DocumentService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createDocumentForm = this.fb.group({
            fileName: new FormControl('', Validators.required),
        });
    }

    onCreateDocument() {
        this.createDocumentState.submit();
        this.documentService.createDocument(this.createDocumentForm.value, this.file._file, this.performOCR).subscribe(
            (result) => {
                this.logger.info('Successfully created Document', result);
                this.createDocumentState.onSuccess(i18next.t('create-document.success_ts'), result);
                this.ocr.emit(result);
                this.complete.emit(this.createDocumentState);
            },
            (error) => {
                this.logger.error('Failed to create Document', error);
                this.createDocumentState.onFailure(i18next.t('create-document.fail_ts'), error.error);
                this.complete.emit(this.createDocumentState);
            },
        );
    }

    onFileSelected(files: FileItem[]) {
        this.file = files[0];
        this.createDocumentForm.controls.fileName.setValue(this.file.file.name);
    }
}
