import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as actions from '@modules/account-relation-document/ngrx/account-relation-document.actions';
import { AccountRelationDocumentState } from '@modules/account-relation-document/ngrx/account-relation-document.reducer';
import { plainToClass } from 'class-transformer';
import { CreateAccountRelationDocumentDto } from '@modules/account-relation-document/services/create-account-relation-document.dto';
import { UpdateAccountRelationDocumentDto } from '@modules/account-relation-document/services/update-account-relation-document.dto';

@Injectable({
    providedIn: 'root',
})
export class AccountRelationDocumentApiService {
    constructor(private http: HttpService, private store: Store<AccountRelationDocumentState>) {}

    getAllAccountRelationDocuments() {
        return this.http.getSecure('account-relation-document').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountRelationDocument, item));
                }
                return [];
            }),
            tap((accountRelationDocuments) => {
                this.store.dispatch(actions.loadAccountRelationDocuments({ accountRelationDocuments }));
            }),
        );
    }

    getAccountRelationDocumentsForRelation(accountRelationId: number) {
        return this.http.getSecure(`account-relation-document/relation/${accountRelationId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountRelationDocument, item));
                }
                return [];
            }),
            tap((accountRelationDocuments) => {
                this.store.dispatch(actions.loadAccountRelationDocuments({ accountRelationDocuments }));
            }),
        );
    }

    getAccountRelationDocument(accountRelationDocumentId: number) {
        return this.http.getSecure(`account-relation-document/${accountRelationDocumentId}`).pipe(
            map((response: object) => {
                return plainToClass(AccountRelationDocument, response);
            }),
            tap((accountRelationDocument) => {
                this.store.dispatch(actions.upsertAccountRelationDocument({ accountRelationDocument }));
            }),
        );
    }

    createAccountRelationDocument(dto: CreateAccountRelationDocumentDto): Observable<AccountRelationDocument> {
        return this.http.postSecure('account-relation-document', dto).pipe(
            map((response: object) => {
                return plainToClass(AccountRelationDocument, response);
            }),
            tap((result) => {
                this.store.dispatch(actions.addAccountRelationDocument({ accountRelationDocument: result }));
            }),
        );
    }

    updateAccountRelationDocument(id: number, dto: UpdateAccountRelationDocumentDto): Observable<AccountRelationDocument> {
        return this.http.postSecure(`account-relation-document/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(AccountRelationDocument, response);
            }),
            tap((result) => {
                this.store.dispatch(
                    actions.updateAccountRelationDocument({
                        accountRelationDocument: { id: result.accountRelationDocumentId, changes: result },
                    }),
                );
            }),
        );
    }

    deleteAccountRelationDocument(accountRelationDocumentId: number) {
        return this.http.deleteSecure(`account-relation-document/${accountRelationDocumentId}`).pipe(
            map((response: object) => {
                return plainToClass(AccountRelationDocument, response);
            }),
            tap((accountRelationDocument) => {
                this.store.dispatch(actions.deleteAccountRelationDocument({ id: `${accountRelationDocument.accountRelationDocumentId}` }));
            }),
        );
    }
}
