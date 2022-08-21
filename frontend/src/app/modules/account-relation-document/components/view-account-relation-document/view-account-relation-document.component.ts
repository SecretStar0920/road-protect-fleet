import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountRelationDocumentState } from '@modules/account-relation-document/ngrx/account-relation-document.reducer';
import { select, Store } from '@ngrx/store';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { AccountRelationDocumentApiService } from '@modules/account-relation-document/services/account-relation-document-api.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { getAccountRelationDocumentById } from '@modules/account-relation-document/ngrx/account-relation-document.selectors';

@Component({
    selector: 'rp-view-account-relation-document',
    templateUrl: './view-account-relation-document.component.html',
    styleUrls: ['./view-account-relation-document.component.less'],
})
export class ViewAccountRelationDocumentComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() accountRelationDocumentId: number;
    accountRelationDocument: AccountRelationDocument;

    updateAccountRelationDocumentState: ElementStateModel<AccountRelationDocument> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<AccountRelationDocument>> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(
        private store: Store<AccountRelationDocumentState>,
        private logger: NGXLogger,
        private accountRelationDocumentService: AccountRelationDocumentApiService,
    ) {}

    ngOnInit() {
        this.getAccountRelationDocument();
    }

    getAccountRelationDocument() {
        this.store
            .pipe(
                select(getAccountRelationDocumentById(this.accountRelationDocumentId)),
                takeUntil(this.destroy$),
                tap((accountRelationDocument) => {
                    if (!accountRelationDocument) {
                        this.logger.debug('Account Relation Document not found on store, querying for it');
                        this.accountRelationDocumentService.getAccountRelationDocument(this.accountRelationDocumentId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.accountRelationDocument = result;
            });
    }

    toggleUpdating() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<AccountRelationDocument>) {
        this.toggleUpdating();
        this.updateAccountRelationDocumentState = state;
    }

    onDelete(deleteState: ElementStateModel<AccountRelationDocument>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
