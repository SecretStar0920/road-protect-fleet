import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DocumentService } from '@modules/document/services/document.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Document } from '@modules/shared/models/entities/document.model';
import { FileItem } from 'ng2-file-upload';
import i18next from 'i18next';
import { GeneralFileUploadComponent } from '@modules/shared/components/general-file-upload/general-file-upload.component';
import { CreateDocumentDto } from '@modules/document/services/create-document.dto';
import { CreateDocumentsDto } from '@modules/document/services/create-documents.dto';
import { isNil } from 'lodash';

@Component({
    selector: 'rp-create-documents',
    templateUrl: './create-documents.component.html',
    styleUrls: ['./create-documents.component.less'],
})
export class CreateDocumentsComponent implements OnInit {
    createDocumentsForm: FormGroup;
    createDocumentsState: ElementStateModel<Document[]> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();
    @Output() ocr: EventEmitter<Document[]> = new EventEmitter();

    @Input() mimeTypes: string[] = []; // @see MimeTypes
    @Input() performOCR: boolean = false; // Should OCR be performed?
    @Input() showSuccess: boolean = true; // Should the success message be shown?

    @Input() maxNumberOfDocuments: number = 1;

    @ViewChild('fileUpload') fileUpload: GeneralFileUploadComponent;

    files: FileItem[] = [];

    get f() {
        return this.createDocumentsForm.controls;
    }

    constructor(private documentService: DocumentService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.createDocumentsForm = this.fb.group({
            fileName: new FormControl('', Validators.required),
        });
    }

    onCreateDocument() {
        this.createDocumentsState.submit();
        const files = this.files.map((file) => file._file)
        const createDtos = this.files.map((file) => {
            const createDto = new CreateDocumentDto()
            createDto.fileName = file.file.name
            return createDto
        })

        const createDocumentsDto = new CreateDocumentsDto()
        createDocumentsDto.documents = createDtos

        this.documentService.createDocuments(createDocumentsDto, files, this.performOCR).subscribe(
            (result) => {
                this.logger.info('Successfully created Document', result);
                this.createDocumentsState.onSuccess(i18next.t('create-document.success_ts'), result);
                this.ocr.emit(result);
                this.complete.emit(this.createDocumentsState);
            },
            (error) => {
                this.logger.error('Failed to create Document', error);
                this.createDocumentsState.onFailure(i18next.t('create-document.fail_ts'), error.error);
                this.complete.emit(this.createDocumentsState);
            },
        );
    }

    onFileSelected(files: FileItem[]) {
        this.files = files;
    }

    get isUploadPossible(): Boolean {
        return !isNil(this.files) && this.files.length > 0
    }
}
