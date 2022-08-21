import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { GeneratedDocument } from '@modules/shared/models/entities/generated-document.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { generatedDocumentNgrxHelper, GeneratedDocumentState } from '@modules/generated-document/ngrx/generated-document.reducer';
import { plainToClass } from 'class-transformer';
import { CreateGeneratedDocumentDto } from '@modules/generated-document/services/create-generated-document.dto';
import { UpdateGeneratedDocumentDto } from '@modules/generated-document/services/update-generated-document.dto';
import { LinkDocumentParamDto } from '@modules/document/services/link-document-param.dto';

@Injectable({
    providedIn: 'root',
})
export class GeneratedDocumentService {
    constructor(private http: HttpService, private store: Store<GeneratedDocumentState>) {}

    getAllGeneratedDocuments() {
        return this.http.getSecure('generated-document').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(GeneratedDocument, item));
                }
                return [];
            }),
            tap((generatedDocuments) => {
                this.store.dispatch(generatedDocumentNgrxHelper.load({ items: generatedDocuments }));
            }),
        );
    }

    getGeneratedDocument(generatedDocumentId: number) {
        return this.http.getSecure(`generated-document/${generatedDocumentId}`).pipe(
            map((response: object) => {
                return plainToClass(GeneratedDocument, response);
            }),
            tap((generatedDocument) => {
                this.store.dispatch(generatedDocumentNgrxHelper.upsertOne({ item: generatedDocument }));
            }),
        );
    }

    createGeneratedDocument(dto: CreateGeneratedDocumentDto): Observable<GeneratedDocument> {
        return this.http.postSecure('generated-document', dto).pipe(
            map((response: object) => {
                return plainToClass(GeneratedDocument, response);
            }),
            tap((result) => {
                this.store.dispatch(generatedDocumentNgrxHelper.upsertOne({ item: result }));
            }),
        );
    }

    generatedGeneratedDocument(generatedDocumentId: number): Observable<GeneratedDocument> {
        return this.http.postSecure(`generated-document/${generatedDocumentId}/generate`, {}).pipe(
            map((response: object) => {
                return plainToClass(GeneratedDocument, response);
            }),
            tap((result) => {
                this.store.dispatch(generatedDocumentNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    confirmGeneratedDocument(generatedDocumentId: number, link: LinkDocumentParamDto): Observable<GeneratedDocument> {
        return this.http.postSecure(`generated-document/${generatedDocumentId}/confirm`, link).pipe(
            map((response: object) => {
                return plainToClass(GeneratedDocument, response);
            }),
            tap((result) => {
                this.store.dispatch(generatedDocumentNgrxHelper.upsertOne({ item: result }));
            }),
        );
    }

    updateGeneratedDocument(id: number, dto: UpdateGeneratedDocumentDto): Observable<GeneratedDocument> {
        return this.http.postSecure(`generated-document/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(GeneratedDocument, response);
            }),
            tap((result) => {
                this.store.dispatch(generatedDocumentNgrxHelper.updateOne({ item: { id: result.generatedDocumentId, changes: result } }));
            }),
        );
    }

    deleteGeneratedDocument(generatedDocumentId: number) {
        return this.http.deleteSecure(`generated-document/${generatedDocumentId}`).pipe(
            map((response: object) => {
                return plainToClass(GeneratedDocument, response);
            }),
            tap((generatedDocument) => {
                this.store.dispatch(generatedDocumentNgrxHelper.deleteOne({ id: `${generatedDocument.generatedDocumentId}` }));
            }),
        );
    }
}
