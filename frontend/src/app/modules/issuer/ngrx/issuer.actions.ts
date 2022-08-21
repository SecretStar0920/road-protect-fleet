import { createAction, props } from '@ngrx/store';
import { Issuer } from '@modules/shared/models/entities/issuer.model';

export const setPoliceIssuer = createAction('[Issuer] Getting police issuer', props<{ issuer: Issuer }>());
