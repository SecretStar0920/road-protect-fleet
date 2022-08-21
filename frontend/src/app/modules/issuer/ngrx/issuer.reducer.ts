import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateIssuerDto } from '@modules/issuer/services/create-issuer.dto';
import { UpdateIssuerDto } from '@modules/issuer/services/update-issuer.dto';
import { createReducer, on } from '@ngrx/store';
import { setPoliceIssuer } from './issuer.actions';

export interface IssuerState extends GeneralEntityState<Issuer> {
    policeIssuer: Issuer;
}

export const issuerEntityAdapter: EntityAdapter<Issuer> = createEntityAdapter<Issuer>({ selectId: (issuer) => issuer.issuerId });

export const initialIssuerState: IssuerState = issuerEntityAdapter.getInitialState({
    // additional entity state properties
    queryParams: {},
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    policeIssuer: undefined,
});

export const selectIssuerFeatureState = (state) => state.issuer;
export const issuerNgrxHelper = new GeneralEntityNGRX<Issuer, CreateIssuerDto, UpdateIssuerDto, IssuerState>(
    'Issuer',
    selectIssuerFeatureState,
    issuerEntityAdapter,
);

export const issuerReducer = createReducer(
    initialIssuerState,
    ...issuerNgrxHelper.reducerOns,
    on(setPoliceIssuer, (state, action) => {
        return {
            ...state,
            policeIssuer: action.issuer,
        };
    }),
);

export function reducer(state = initialIssuerState, action): IssuerState {
    return issuerReducer(state, action);
}
