import { createAction, props } from '@ngrx/store';

export const selectAccount = createAction('[Account] Select Account', props<{ id: number }>());
