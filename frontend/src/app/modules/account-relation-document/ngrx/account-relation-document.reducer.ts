import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as AccountRelationDocumentActions from './account-relation-document.actions';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';

// TODO: Update to use helper

export const accountRelationDocumentsFeatureKey = 'accountRelationDocument';

export interface AccountRelationDocumentState extends EntityState<AccountRelationDocument> {
    // additional entities state properties
}

export const adapter: EntityAdapter<AccountRelationDocument> = createEntityAdapter<AccountRelationDocument>({
    selectId: (ard) => ard.accountRelationDocumentId,
});

export const initialState: AccountRelationDocumentState = adapter.getInitialState({
    // additional entity state properties
});

const accountRelationDocumentReducer = createReducer(
    initialState,
    on(AccountRelationDocumentActions.addAccountRelationDocument, (state, action) => adapter.addOne(action.accountRelationDocument, state)),
    on(AccountRelationDocumentActions.upsertAccountRelationDocument, (state, action) =>
        adapter.upsertOne(action.accountRelationDocument, state),
    ),
    on(AccountRelationDocumentActions.addAccountRelationDocuments, (state, action) =>
        adapter.addMany(action.accountRelationDocuments, state),
    ),
    on(AccountRelationDocumentActions.upsertAccountRelationDocuments, (state, action) =>
        adapter.upsertMany(action.accountRelationDocuments, state),
    ),
    on(AccountRelationDocumentActions.updateAccountRelationDocument, (state, action) =>
        adapter.updateOne(action.accountRelationDocument, state),
    ),
    on(AccountRelationDocumentActions.updateAccountRelationDocuments, (state, action) =>
        adapter.updateMany(action.accountRelationDocuments, state),
    ),
    on(AccountRelationDocumentActions.deleteAccountRelationDocument, (state, action) => adapter.removeOne(action.id, state)),
    on(AccountRelationDocumentActions.deleteAccountRelationDocuments, (state, action) => adapter.removeMany(action.ids, state)),
    on(AccountRelationDocumentActions.loadAccountRelationDocuments, (state, action) =>
        adapter.setAll(action.accountRelationDocuments, state),
    ),
    on(AccountRelationDocumentActions.clearAccountRelationDocuments, (state) => adapter.removeAll(state)),
);

export function reducer(state: AccountRelationDocumentState | undefined, action: Action) {
    return accountRelationDocumentReducer(state, action);
}

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
