import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Document } from '@modules/shared/models/entities/document.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { documentNgrxHelper, DocumentState } from '@modules/document/ngrx/document.reducer';
import { plainToClass } from 'class-transformer';
import { CreateDocumentDto } from '@modules/document/services/create-document.dto';
import { UpdateDocumentDto } from '@modules/document/services/update-document.dto';
import { LinkDocumentParamDto } from '@modules/document/services/link-document-param.dto';
import { ContractService } from '@modules/contract/services/contract.service';
import { AccountService } from '@modules/account/services/account.service';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { CreateDocumentsDto } from '@modules/document/services/create-documents.dto';

export enum DocumentLinkableTargets {
    Contract = 'contract',
    Account = 'account',
    Infringement = 'infringement',
    NominationFinal = 'nominationFinal',
    NominationRedirection = 'nominationRedirection',
    ContractRedirection = 'contractRedirection',
}

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    constructor(
        private http: HttpService,
        private store: Store<DocumentState>,
        private contractService: ContractService,
        private accountService: AccountService,
    ) {}
    contract: Contract;

    getAllDocuments() {
        return this.http.getSecure('document').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Document, item));
                }
                return [];
            }),
            tap((documents) => {
                this.store.dispatch(documentNgrxHelper.load({ items: documents }));
            }),
        );
    }

    getDocument(documentId: number) {
        return this.http.getSecure(`document/${documentId}`).pipe(
            map((response: object) => {
                return plainToClass(Document, response);
            }),
            tap((document) => {
                this.store.dispatch(documentNgrxHelper.upsertOne({ item: document }));
            }),
        );
    }

    getDocumentFile(documentId: number) {
        return this.http.downloadFile(`document/${documentId}/file`);
    }

    createDocument(dto: CreateDocumentDto, file, ocr?: boolean): Observable<Document> {
        return this.http.uploadFile('document', file, dto, ocr).pipe(
            map((response: object) => {
                return plainToClass(Document, response);
            }),
            tap((result) => {
                this.store.dispatch(documentNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    createDocuments(dto: CreateDocumentsDto, files: File[], ocr?: boolean): Observable<Document[]> {
        return this.http.uploadFiles('document/batch', files, dto, ocr).pipe(
            map((response: any) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Document, item));
                }

                return [];
            }),
            tap((result) => {
                this.store.dispatch(documentNgrxHelper.addMany({ items: result }));
            }),
        );
    }

    linkDocument(dto: LinkDocumentParamDto): Observable<Document> {
        return this.http.postSecure(`document/${dto.documentId}/link/${dto.target}/${dto.targetId}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Document, response);
            }),
            tap((result) => {
                this.store.dispatch(documentNgrxHelper.updateOne({ item: { id: result.documentId, changes: result } }));
                if (dto.target === DocumentLinkableTargets.Contract) {
                    this.contractService.updateContractOcrStatus(+dto.targetId).subscribe();
                } else if (dto.target === DocumentLinkableTargets.Account) {
                    this.accountService.getAccount(+dto.targetId).subscribe();
                }
            }),
        );
    }

    updateDocument(id: number, dto: UpdateDocumentDto): Observable<Document> {
        return this.http.postSecure(`document/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Document, response);
            }),
            tap((result) => {
                this.store.dispatch(documentNgrxHelper.updateOne({ item: { id: result.documentId, changes: result } }));
            }),
        );
    }

    deleteDocument(documentId: number) {
        return this.http.deleteSecure(`document/${documentId}`).pipe(
            map((response: object) => {
                return plainToClass(Document, response);
            }),
            tap((document) => {
                this.store.dispatch(documentNgrxHelper.deleteOne({ id: `${document.documentId}` }));
            }),
        );
    }
}
