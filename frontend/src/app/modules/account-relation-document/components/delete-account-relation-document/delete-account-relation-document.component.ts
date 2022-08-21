import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';
import { AccountRelationDocumentApiService } from '@modules/account-relation-document/services/account-relation-document-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-delete-account-relation-document',
    templateUrl: './delete-account-relation-document.component.html',
    styleUrls: ['./delete-account-relation-document.component.less'],
})
export class DeleteAccountRelationDocumentComponent implements OnInit {
    @Input() accountRelationDocumentId: number;

    deleteAccountRelationDocumentState: ElementStateModel<AccountRelationDocument> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<AccountRelationDocument>> = new EventEmitter();

    constructor(private accountRelationDocumentService: AccountRelationDocumentApiService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteAccountRelationDocumentState.submit();
        this.accountRelationDocumentService.deleteAccountRelationDocument(this.accountRelationDocumentId).subscribe(
            (accountRelationDocument) => {
                this.deleteAccountRelationDocumentState.onSuccess(
                    'Successfully deleted Account relation document',
                    accountRelationDocument,
                );
                this.message.success(this.deleteAccountRelationDocumentState.successResult().message);
                this.delete.emit(this.deleteAccountRelationDocumentState);
            },
            (error) => {
                this.deleteAccountRelationDocumentState.onFailure('Failed to delete Account relation document', error);
                this.message.error(this.deleteAccountRelationDocumentState.failedResult().message);
            },
        );
    }
}
