import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DocumentState } from '@modules/document/ngrx/document.reducer';
import { select, Store } from '@ngrx/store';
import { Document } from '@modules/shared/models/entities/document.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { DocumentService } from '@modules/document/services/document.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { getDocumentById } from '@modules/document/ngrx/document.selectors';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteDocumentComponent } from '@modules/document/components/delete-document/delete-document.component';

@Component({
    selector: 'rp-view-document',
    templateUrl: './view-document.component.html',
    styleUrls: ['./view-document.component.less'],
})
export class ViewDocumentComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    private _documentId: number;
    get documentId(): number {
        return this._documentId;
    }
    @Input()
    set documentId(value: number) {
        this._documentId = value;
        this.getDocument();
    }

    @Input() document: Document;

    @Input() enableDelete: boolean = false;
    @Input() enableCustomDelete: boolean = false;

    updateDocumentState: ElementStateModel<Document> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Document>> = new EventEmitter();
    @Output() customDelete: EventEmitter<Document> = new EventEmitter();

    downloadDocumentState: ElementStateModel = new ElementStateModel<any>();

    @ViewChild('deleteDocumentComponent', { static: false }) deleteDocumentComponent: DeleteDocumentComponent;

    private destroy$ = new Subject();

    constructor(
        private store: Store<DocumentState>,
        private logger: NGXLogger,
        private documentService: DocumentService,
        private modalService: NzModalService,
    ) {}

    ngOnInit() {}

    getDocument() {
        if (!this.document && !!this._documentId) {
            this.store
                .pipe(
                    select(getDocumentById(this._documentId)),
                    takeUntil(this.destroy$),
                    tap((document) => {
                        if (!document) {
                            this.logger.debug('Document not found on store, querying for it');
                            this.documentService.getDocument(this._documentId).subscribe();
                        }
                    }),
                )
                .subscribe((result) => {
                    this.document = result;
                });
        }
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Document>) {
        this.onUpdate();
        this.updateDocumentState = state;
    }

    onDownloadFile() {
        this.downloadDocumentState.submit();
        this.documentService.getDocumentFile(this._documentId || this.document.documentId).subscribe(
            (result) => {
                this.downloadDocumentState.onSuccess();
                saveAs(result.file, result.filename);
            },
            (error) => {
                this.downloadDocumentState.onFailure();
            },
        );
    }

    get documentDate(): Date {
        if (!this.document) {
            return undefined
        }

        return new Date(this.document.createdAt)
    }

    deleteDocument() {
        if (this.enableDelete) {
            this.deleteDocumentComponent.onDelete()
        } else if (this.enableCustomDelete) {
            this.customDelete.emit(this.document)
        }
    }

    onDelete(deleteState: ElementStateModel<Document>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
