import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountRelationDocumentApiService } from '@modules/account-relation-document/services/account-relation-document-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationDocument, AccountRelationDocumentType } from '@modules/shared/models/entities/account-relation-document.model';

@Component({
    selector: 'rp-create-account-relation-document',
    templateUrl: './create-account-relation-document.component.html',
    styleUrls: ['./create-account-relation-document.component.less'],
})
export class CreateAccountRelationDocumentComponent implements OnInit {
    createAccountRelationDocumentForm: FormGroup;
    createAccountRelationDocumentState: ElementStateModel<AccountRelationDocument> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    types = Object.values(AccountRelationDocumentType);
    @Input() accountRelationId: number;

    get f() {
        return this.createAccountRelationDocumentForm.controls;
    }

    constructor(
        private accountRelationDocumentService: AccountRelationDocumentApiService,
        private fb: FormBuilder,
        private logger: NGXLogger,
    ) {}

    ngOnInit() {
        this.createAccountRelationDocumentForm = this.fb.group({
            documentId: new FormControl(null, Validators.required),
            accountRelationId: new FormControl(this.accountRelationId, Validators.required),
            type: new FormControl(AccountRelationDocumentType.Other, Validators.required),
        });
    }

    onCreateAccountRelationDocument() {
        this.createAccountRelationDocumentState.submit();
        this.accountRelationDocumentService.createAccountRelationDocument(this.createAccountRelationDocumentForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Account Relation Document', result);
                this.createAccountRelationDocumentState.onSuccess('Successfully created Account Relation Document', result);
                this.complete.emit(this.createAccountRelationDocumentState);
            },
            (error) => {
                this.logger.error('Failed to create Account Relation Document', error);
                this.createAccountRelationDocumentState.onFailure('Failed to create Account Relation Document', error.error);
                this.complete.emit(this.createAccountRelationDocumentState);
            },
        );
    }
}
