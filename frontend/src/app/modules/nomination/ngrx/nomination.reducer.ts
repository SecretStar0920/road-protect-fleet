import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { createReducer, on } from '@ngrx/store';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { CreateNominationDto } from '@modules/nomination/services/create-nomination.dto';
import { UpdateNominationDto } from '@modules/nomination/services/update-nomination.dto';
import {
    batchDigitalRedirectionNominationReqSuccess,
    batchMunicipalPayNominationReqSuccess,
    batchMunicipalRedirectNominationReqSuccess,
    nominationLoading,
} from '@modules/nomination/ngrx/nomination.actions';
import { IBatchPaymentResult } from '@modules/nomination/services/nomination.service';
import { IBatchRedirectionsResult } from '@modules/nomination/components/batch-municipally-redirect-nominations/batch-municipally-redirection-nominations.component';
import { IBatchDigitalRedirectionsResult } from '@modules/nomination/components/batch-digitally-redirect-nominations/batch-digitally-redirection-nominations.component';

export interface NominationState extends GeneralEntityState<Nomination> {
    nominationLoading: number;
    batchPaymentResultData: IBatchPaymentResult;
    batchMunicipalRedirectionResultData: IBatchRedirectionsResult;
    batchDigitalRedirectionResultData: IBatchDigitalRedirectionsResult;
}

export const nominationEntityAdapter: EntityAdapter<Nomination> = createEntityAdapter<Nomination>({
    selectId: (nomination) => nomination.nominationId,
});

export const initialNominationState: NominationState = nominationEntityAdapter.getInitialState({
    nominationLoading: 0,
    selectedRowIds: [],
    currentPageIds: [],
    selectedId: null,
    queryParams: {},
    batchPaymentResultData: { successful: [], failed: [] },
    batchMunicipalRedirectionResultData: { successfulRedirections: [], failedRedirections: [] },
    batchDigitalRedirectionResultData: { successfulRedirections: [], failedRedirections: [] },
});

export const selectNominationFeatureState = (state) => state.nomination;
export const nominationNgrxHelper = new GeneralEntityNGRX<Nomination, CreateNominationDto, UpdateNominationDto, NominationState>(
    'Nomination',
    selectNominationFeatureState,
    nominationEntityAdapter,
);

export const nominationReducer = createReducer(
    initialNominationState,
    ...nominationNgrxHelper.reducerOns,
    on(nominationLoading, (state: NominationState, action) => {
        return {
            ...state,
            nominationLoading: action.loading ? state.nominationLoading + 1 : state.nominationLoading - 1,
        };
    }),
    on(batchMunicipalPayNominationReqSuccess, (state, action) => {
        return { ...state, batchPaymentResultData: action.result };
    }),
    on(batchMunicipalRedirectNominationReqSuccess, (state, action) => {
        return { ...state, batchMunicipalRedirectionResultData: action.result };
    }),
    on(batchDigitalRedirectionNominationReqSuccess, (state, action) => {
        return { ...state, batchDigitalRedirectionResultData: action.result };
    }),
);

export function reducer(state, action) {
    return nominationReducer(state, action);
}
