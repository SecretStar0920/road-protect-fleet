import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { GeneratedDocument } from '@modules/shared/models/entities/generated-document.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateGeneratedDocumentDto } from '@modules/generated-document/services/create-generated-document.dto';
import { createReducer } from '@ngrx/store';

export interface GeneratedDocumentState extends GeneralEntityState<GeneratedDocument> {
    // additional entities state properties
}

export const generatedDocumentEntityAdapter: EntityAdapter<GeneratedDocument> = createEntityAdapter<GeneratedDocument>({
    selectId: (generatedDocument) => generatedDocument.generatedDocumentId,
});

export const initialGeneratedDocumentState: GeneratedDocumentState = generatedDocumentEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
});
export const selectGeneratedDocumentFeatureState = (state) => state.generatedDocument;
export const generatedDocumentNgrxHelper = new GeneralEntityNGRX<
    GeneratedDocument,
    CreateGeneratedDocumentDto,
    any,
    GeneratedDocumentState
>('Generated Document', selectGeneratedDocumentFeatureState, generatedDocumentEntityAdapter);

export const generatedDocumentReducer = createReducer(initialGeneratedDocumentState, ...generatedDocumentNgrxHelper.reducerOns);

export function reducer(state = initialGeneratedDocumentState, action): GeneratedDocumentState {
    return generatedDocumentReducer(state, action);
}
