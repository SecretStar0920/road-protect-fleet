import { createAction, props } from '@ngrx/store';

export const resetContractQueryParameters = createAction('[Contract] Reset Query Params');

export const bulkOcr = createAction('[Contract] Bulk run OCR', props<{ contractIds: number[] }>());

export const contractLoading = createAction('[Contract] Loading', props<{ loading: boolean }>());
