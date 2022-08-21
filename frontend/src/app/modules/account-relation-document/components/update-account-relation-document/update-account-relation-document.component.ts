import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationDocumentApiService } from '@modules/account-relation-document/services/account-relation-document-api.service';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'rp-update-account-relation-document',
    templateUrl: './update-account-relation-document.component.html',
    styleUrls: ['./update-account-relation-document.component.less'],
})
export class UpdateAccountRelationDocumentComponent implements OnInit {
    @Input() accountRelationDocument: AccountRelationDocument;

    updateAccountRelationDocumentForm: FormGroup;
    updateAccountRelationDocumentState: ElementStateModel<AccountRelationDocument> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<AccountRelationDocument>> = new EventEmitter();

    get f() {
        return this.updateAccountRelationDocumentForm.controls;
    }

    constructor(
        private accountRelationDocumentService: AccountRelationDocumentApiService,
        private fb: FormBuilder,
        private logger: NGXLogger,
    ) {}

    ngOnInit() {
        this.updateAccountRelationDocumentForm = this.fb.group({
            // TODO: insert form fields
        });
    }

    onUpdateAccountRelationDocument() {
        this.updateAccountRelationDocumentState.submit();
        this.accountRelationDocumentService
            .updateAccountRelationDocument(
                this.accountRelationDocument.accountRelationDocumentId,
                this.updateAccountRelationDocumentForm.value,
            )
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated Account Relation Document', result);
                    this.updateAccountRelationDocumentState.onSuccess('Successfully updated accountRelationDocument', result);
                    this.complete.emit(this.updateAccountRelationDocumentState);
                },
                (error) => {
                    this.logger.error('Failed to update Account Relation Document', error);
                    this.updateAccountRelationDocumentState.onFailure('Failed to update accountRelationDocument', error.error);
                    this.complete.emit(this.updateAccountRelationDocumentState);
                },
            );
    }
}
