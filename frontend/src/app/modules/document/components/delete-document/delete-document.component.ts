import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Document } from '@modules/shared/models/entities/document.model';
import { DocumentService } from '@modules/document/services/document.service';
import i18next from 'i18next';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-delete-document',
    templateUrl: './delete-document.component.html',
    styleUrls: ['./delete-document.component.less'],
})
export class DeleteDocumentComponent implements OnInit {
    @Input() customDelete: boolean = false;
    @Input() documentId: number;

    deleteDocumentState: ElementStateModel<Document> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Document>> = new EventEmitter();

    constructor(private documentService: DocumentService, private message: NzMessageService, private modalService: NzModalService) {}

    ngOnInit() {}

    onDelete() {
        if (this.customDelete) {
            return
        }

        this.modalService.confirm({
            nzTitle: `<i>${i18next.t('delete-document.confirm')}</i>`,
            nzOnOk: () => this.deleteDocument(),
        });
    }

    deleteDocument() {
        if (this.customDelete) {
            return
        }

        this.deleteDocumentState.submit();
        this.documentService.deleteDocument(this.documentId).subscribe(
            (document) => {
                this.deleteDocumentState.onSuccess(i18next.t('delete-document.success'), document);
                // this.message.success(this.deleteDocumentState.successResult().message);
                this.delete.emit(this.deleteDocumentState);
            },
            (error) => {
                this.deleteDocumentState.onFailure(i18next.t('delete-document.failure'), error);
                // this.message.error(this.deleteDocumentState.failedResult().message);
            },
        );
    }
}
