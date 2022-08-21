import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { InfringementNote } from '@modules/shared/models/entities/infringement-note.model';

export const loadInfringementNotes = createAction(
    '[InfringementNote/API] Load InfringementNotes',
    props<{ infringementNotes: InfringementNote[] }>(),
);

export const addInfringementNote = createAction(
    '[InfringementNote/API] Add InfringementNote',
    props<{ infringementNote: InfringementNote }>(),
);

export const upsertInfringementNote = createAction(
    '[InfringementNote/API] Upsert InfringementNote',
    props<{ infringementNote: InfringementNote }>(),
);

export const addInfringementNotes = createAction(
    '[InfringementNote/API] Add InfringementNotes',
    props<{ infringementNotes: InfringementNote[] }>(),
);

export const upsertInfringementNotes = createAction(
    '[InfringementNote/API] Upsert InfringementNotes',
    props<{ infringementNotes: InfringementNote[] }>(),
);

export const updateInfringementNote = createAction(
    '[InfringementNote/API] Update InfringementNote',
    props<{ infringementNote: Update<InfringementNote> }>(),
);

export const updateInfringementNotes = createAction(
    '[InfringementNote/API] Update InfringementNotes',
    props<{ infringementNotes: Update<InfringementNote>[] }>(),
);

export const deleteInfringementNote = createAction('[InfringementNote/API] Delete InfringementNote', props<{ id: string }>());

export const deleteInfringementNotes = createAction('[InfringementNote/API] Delete InfringementNotes', props<{ ids: string[] }>());

export const clearInfringementNotes = createAction('[InfringementNote/API] Clear InfringementNotes');
