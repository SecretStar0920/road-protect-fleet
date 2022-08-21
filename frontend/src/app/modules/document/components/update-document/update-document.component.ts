import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Document } from '@modules/shared/models/entities/document.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { DocumentService } from '@modules/document/services/document.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-document',
    templateUrl: './update-document.component.html',
    styleUrls: ['./update-document.component.less'],
})
export class UpdateDocumentComponent implements OnInit {
    @Input() document: Document;

    updateDocumentForm: FormGroup;
    updateDocumentState: ElementStateModel<Document> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Document>> = new EventEmitter();

    get f() {
        return this.updateDocumentForm.controls;
    }

    constructor(private documentService: DocumentService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateDocumentForm = this.fb.group({
            // name: new FormControl(this.document.name, Validators.required),
            // identifier: new FormControl(this.document.identifier, Validators.required),
        });
    }

    onUpdateDocument() {
        this.updateDocumentState.submit();
        this.documentService.updateDocument(this.document.documentId, this.updateDocumentForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully updated Document', result);
                this.updateDocumentState.onSuccess(i18next.t('update-document.success'), result);
                this.complete.emit(this.updateDocumentState);
            },
            (error) => {
                this.logger.error('Failed to update Document', error);
                this.updateDocumentState.onFailure(i18next.t('update-document.fail'), error.error);
                this.complete.emit(this.updateDocumentState);
            },
        );
    }
}
