import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { DocumentService } from '@modules/document/services/document.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { Document } from '@modules/shared/models/entities/document.model';
import { select, Store } from '@ngrx/store';
import * as documentSelectors from '@modules/document/ngrx/document.selectors';
import { DocumentState } from '@modules/document/ngrx/document.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';

@Component({
    selector: 'rp-view-documents',
    templateUrl: './view-documents.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-documents.component.less'],
})
export class ViewDocumentsComponent implements OnInit, OnDestroy {
    documents: Document[];
    getDocumentsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor(private documentService: DocumentService, public table: GeneralTableService, private store: Store<DocumentState>) {
        this.table.options.primaryColumnKey = 'documentId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
            {
                key: 'documentId',
                title: 'id',
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getDocuments();
    }

    getDocuments() {
        this.getDocumentsState.submit();
        this.documentService.getAllDocuments().subscribe(
            (result) => {
                this.getDocumentsState.onSuccess(i18next.t('view-documents.success'), result);
            },
            (error) => {
                this.getDocumentsState.onFailure(i18next.t('view-documents.fail'), error.error);
            },
        );
        this.store.pipe(select(documentSelectors.selectAll), takeUntil(this.destroy$)).subscribe((result) => {
            this.documents = result;
            this.table.data = this.documents.slice();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
