import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Document } from '@modules/shared/models/entities/document.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateDocumentDto } from '@modules/document/services/create-document.dto';
import { UpdateDocumentDto } from '@modules/document/services/update-document.dto';
import { createReducer } from '@ngrx/store';

export interface DocumentState extends GeneralEntityState<Document> {
    // additional entities state properties
}

export const documentEntityAdapter: EntityAdapter<Document> = createEntityAdapter<Document>({
    selectId: (document) => document.documentId,
});

export const initialDocumentState: DocumentState = documentEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});
export const selectDocumentFeatureState = (state) => state.document;
export const documentNgrxHelper = new GeneralEntityNGRX<Document, CreateDocumentDto, UpdateDocumentDto, DocumentState>(
    'Document',
    selectDocumentFeatureState,
    documentEntityAdapter,
);

export const documentReducer = createReducer(initialDocumentState, ...documentNgrxHelper.reducerOns);

export function reducer(state = initialDocumentState, action): DocumentState {
    return documentReducer(state, action);
}
