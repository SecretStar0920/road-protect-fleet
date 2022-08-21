import { createSelector } from '@ngrx/store';
import { adapter } from '@modules/infringement-note/ngrx/infringement-note.reducer';

export const selectInfringementNoteFeatureState = (state) => state.infringementNote;
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectInfringementNoteFeatureState);

export const getInfringementNoteById = (infringementNoteId: number) => {
    return createSelector(selectEntities, (infringementNoteEntities) => infringementNoteEntities[infringementNoteId]);
};

export const getInfringementNotesByInfringementId = (infringementId: number) => {
    return createSelector(selectAll, (infringementNotes) => {
        return infringementNotes.filter((infringementNote) => {
            return infringementNote.infringement.infringementId === infringementId;
        });
    });
};

export const getInfringementNotesQuery = createSelector(selectInfringementNoteFeatureState, (state) => state.query);
