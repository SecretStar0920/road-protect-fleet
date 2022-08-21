import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { createReducer, on } from '@ngrx/store';
import { GeneralEntityNGRX, GeneralEntityState } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';
import { UpdateInfringementDto } from '@modules/infringement/services/update-infringement.dto';
import { CreateInfringementDto } from '@modules/infringement/services/create-infringement.dto';
import {
    infringementLoading,
    redirectMissingInfringementsRequestSuccess,
    redirectMissingInfringementsReset,
    redirectMissingInfringementsSkipRedirections,
    resetInfringementQueryParameters,
    setAccountInAdminInfringementUpload,
    setFileInAdminInfringementUpload,
    setFileUploadDataInAdminInfringementUpload,
    setIssuersInAdminInfringementUpload,
    setUploadResponseInAdminInfringementUpload,
    setVerifyResponseInAdminInfringementUpload,
} from '@modules/infringement/ngrx/infringement.actions';
import { AdminInfringementUpload } from '@modules/infringement/ngrx/admin-infringement-upload.interface';
import { cloneDeep } from 'lodash';

export interface InfringementState extends GeneralEntityState<Infringement> {
    infringementLoading: number;
    // additional entities state properties
    adminUpload: AdminInfringementUpload;
}

const defaultAdminUpload: AdminInfringementUpload = {
    issuers: [],
    account: null,
    uploadResponse: {
        missingInfringements: [],
        createCount: 0,
        invalidCount: 0,
        invalidDocumentId: 0,
        updateCount: 0,
        validCount: 0,
        validDocumentId: 0,
    },
    verifyResponse: null,
    fileUpload: {
        files: [],
        selectedSheetName: '',
        sheetHeadings: [],
        spreadsheet: null,
        spreadsheetData: [],
        spreadsheetFile: null,
    },
    missingInfringements: {
        loading: false,
        submitResponse: null,
        skipRedirections: false,
    },
};

export const infringementEntityAdapter: EntityAdapter<Infringement> = createEntityAdapter<Infringement>({
    selectId: (infringement) => infringement.infringementId,
});

export const initialInfringementState: InfringementState = infringementEntityAdapter.getInitialState({
    // additional entity state properties
    infringementLoading: 0,
    queryParams: {
        mine: false,
        via: 'onVehicles',
        graphing: false,
        startDate: undefined,
        endDate: undefined,
        vehicleRegistration: null,
        infringementStatus: null,
        issuers: [],
    },
    currentPageIds: [],
    selectedRowIds: [],
    selectedId: null,
    entities: {},
    ids: [],
    adminUpload: cloneDeep(defaultAdminUpload),
});

export const selectInfringementFeatureState = (state) => state.infringement;
export const infringementNgrxHelper = new GeneralEntityNGRX<Infringement, CreateInfringementDto, UpdateInfringementDto, InfringementState>(
    'Infringement',
    selectInfringementFeatureState,
    infringementEntityAdapter,
);

export const infringementReducer = createReducer(
    initialInfringementState,
    ...infringementNgrxHelper.reducerOns,
    on(infringementLoading, (state: InfringementState, action) => {
        return {
            ...state,
            infringementLoading: action.loading ? state.infringementLoading + 1 : state.infringementLoading - 1,
        };
    }),
    on(setIssuersInAdminInfringementUpload, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            issuers: action.issuers,
        },
    })),
    on(setAccountInAdminInfringementUpload, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            account: action.account,
        },
    })),
    on(setFileInAdminInfringementUpload, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            fileUpload: {
                ...state.adminUpload.fileUpload,
                files: action.files,
            },
        },
    })),
    on(setFileUploadDataInAdminInfringementUpload, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            fileUpload: action.uploadData,
        },
    })),
    on(setVerifyResponseInAdminInfringementUpload, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            verifyResponse: action.response,
        },
    })),
    on(setUploadResponseInAdminInfringementUpload, (state, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            uploadResponse: { ...state.adminUpload.uploadResponse, ...action.response },
        },
    })),
    on(redirectMissingInfringementsRequestSuccess, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            missingInfringements: {
                ...state.adminUpload.missingInfringements,
                loading: false,
                submitResponse: action.response,
            },
        },
    })),
    on(redirectMissingInfringementsSkipRedirections, (state: InfringementState, action) => ({
        ...state,
        adminUpload: {
            ...state.adminUpload,
            missingInfringements: {
                ...state.adminUpload.missingInfringements,
                skipRedirections: true,
            },
        },
    })),
    on(redirectMissingInfringementsReset, (state: InfringementState, action) => ({
        ...state,
        adminUpload: cloneDeep(defaultAdminUpload),
    })),
    on(resetInfringementQueryParameters, (state, action) => {
        return { ...state, queryParams: initialInfringementState.queryParams };
    }),
);

export function reducer(state, action) {
    return infringementReducer(state, action);
}
