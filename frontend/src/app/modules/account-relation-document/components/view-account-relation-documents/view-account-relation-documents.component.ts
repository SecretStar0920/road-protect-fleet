import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AccountRelationDocumentApiService } from '@modules/account-relation-document/services/account-relation-document-api.service';
import { GeneralTableService } from '@modules/shared/components/general-table/service/general-table.service';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';
import { select, Store } from '@ngrx/store';
import * as accountRelationDocumentSelectors from '@modules/account-relation-document/ngrx/account-relation-document.selectors';
import { AccountRelationDocumentState } from '@modules/account-relation-document/ngrx/account-relation-document.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';

@Component({
    selector: 'rp-view-account-relation-documents',
    templateUrl: './view-account-relation-documents.component.html',
    providers: [GeneralTableService],
    styleUrls: ['./view-account-relation-documents.component.less'],
})
export class ViewAccountRelationDocumentsComponent implements OnInit, OnDestroy {
    accountRelationDocuments: AccountRelationDocument[];
    getAccountRelationDocumentsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    @Input() accountRelationId: number;
    showAddDocument: boolean = false;
    permissions = PERMISSIONS;

    constructor(
        private accountRelationDocumentService: AccountRelationDocumentApiService,
        public table: GeneralTableService,
        private store: Store<AccountRelationDocumentState>,
    ) {
        this.table.options.primaryColumnKey = 'accountRelationDocumentId';
        this.table.options.enableRowSelect = false;
        this.table.customColumns = [
            {
                key: 'accountRelationDocumentId',
                title: 'id',
            },
            // Add other fields here
        ];
    }

    ngOnInit() {
        if (this.action) {
            this.table.columnActionTemplate = this.action;
        }
        this.getAccountRelationDocuments();
    }

    getAccountRelationDocuments() {
        this.getAccountRelationDocumentsState.submit();
        this.accountRelationDocumentService.getAccountRelationDocumentsForRelation(this.accountRelationId).subscribe(
            (result) => {
                this.getAccountRelationDocumentsState.onSuccess('Successfully retrieved Account Relation Documents', result);
            },
            (error) => {
                this.getAccountRelationDocumentsState.onFailure('Failed to retrieve Account Relation Documents', error.error);
            },
        );
        this.store
            .pipe(
                select(accountRelationDocumentSelectors.getAccountRelationDocumentsByRelationId(this.accountRelationId)),
                takeUntil(this.destroy$),
            )
            .subscribe((result) => {
                this.accountRelationDocuments = result;
                this.table.data = this.accountRelationDocuments.slice();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onShowAddDocument() {
        this.toggleShowAddDocument();
    }

    toggleShowAddDocument() {
        this.showAddDocument = !this.showAddDocument;
    }
}
