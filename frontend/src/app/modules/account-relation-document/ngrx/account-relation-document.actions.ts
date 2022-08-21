import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AccountRelationDocument } from '@modules/shared/models/entities/account-relation-document.model';

export const loadAccountRelationDocuments = createAction(
    '[AccountRelationDocument/API] Load AccountRelationDocuments',
    props<{ accountRelationDocuments: AccountRelationDocument[] }>(),
);

export const addAccountRelationDocument = createAction(
    '[AccountRelationDocument/API] Add AccountRelationDocument',
    props<{ accountRelationDocument: AccountRelationDocument }>(),
);

export const upsertAccountRelationDocument = createAction(
    '[AccountRelationDocument/API] Upsert AccountRelationDocument',
    props<{ accountRelationDocument: AccountRelationDocument }>(),
);

export const addAccountRelationDocuments = createAction(
    '[AccountRelationDocument/API] Add AccountRelationDocuments',
    props<{ accountRelationDocuments: AccountRelationDocument[] }>(),
);

export const upsertAccountRelationDocuments = createAction(
    '[AccountRelationDocument/API] Upsert AccountRelationDocuments',
    props<{ accountRelationDocuments: AccountRelationDocument[] }>(),
);

export const updateAccountRelationDocument = createAction(
    '[AccountRelationDocument/API] Update AccountRelationDocument',
    props<{ accountRelationDocument: Update<AccountRelationDocument> }>(),
);

export const updateAccountRelationDocuments = createAction(
    '[AccountRelationDocument/API] Update AccountRelationDocuments',
    props<{ accountRelationDocuments: Update<AccountRelationDocument>[] }>(),
);

export const deleteAccountRelationDocument = createAction(
    '[AccountRelationDocument/API] Delete AccountRelationDocument',
    props<{ id: string }>(),
);

export const deleteAccountRelationDocuments = createAction(
    '[AccountRelationDocument/API] Delete AccountRelationDocuments',
    props<{ ids: string[] }>(),
);

export const clearAccountRelationDocuments = createAction('[AccountRelationDocument/API] Clear AccountRelationDocuments');
