import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IssuerState } from '@modules/issuer/ngrx/issuer.reducer';

const issuerSelector = createFeatureSelector('issuer');
export const policeIssuer = createSelector(issuerSelector, (state: IssuerState) => state.policeIssuer);
