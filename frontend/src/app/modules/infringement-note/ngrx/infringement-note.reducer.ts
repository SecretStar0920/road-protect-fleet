import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as InfringementNoteActions from './infringement-note.actions';
import { InfringementNote } from '@modules/shared/models/entities/infringement-note.model';

export const infringementNotesFeatureKey = 'infringementNote';

export interface State extends EntityState<InfringementNote> {
    // additional entities state properties
}

export const adapter: EntityAdapter<InfringementNote> = createEntityAdapter<InfringementNote>({
    selectId: (note) => note.infringementNoteId,
});

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
});

const infringementNoteReducer = createReducer(
    initialState,
    on(InfringementNoteActions.addInfringementNote, (state, action) => adapter.addOne(action.infringementNote, state)),
    on(InfringementNoteActions.upsertInfringementNote, (state, action) => adapter.upsertOne(action.infringementNote, state)),
    on(InfringementNoteActions.addInfringementNotes, (state, action) => adapter.addMany(action.infringementNotes, state)),
    on(InfringementNoteActions.upsertInfringementNotes, (state, action) => adapter.upsertMany(action.infringementNotes, state)),
    on(InfringementNoteActions.updateInfringementNote, (state, action) => adapter.updateOne(action.infringementNote, state)),
    on(InfringementNoteActions.updateInfringementNotes, (state, action) => adapter.updateMany(action.infringementNotes, state)),
    on(InfringementNoteActions.deleteInfringementNote, (state, action) => adapter.removeOne(action.id, state)),
    on(InfringementNoteActions.deleteInfringementNotes, (state, action) => adapter.removeMany(action.ids, state)),
    on(InfringementNoteActions.loadInfringementNotes, (state, action) => adapter.setAll(action.infringementNotes, state)),
    on(InfringementNoteActions.clearInfringementNotes, (state) => adapter.removeAll(state)),
);

export function reducer(state: State | undefined, action: Action) {
    return infringementNoteReducer(state, action);
}
