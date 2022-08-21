import { createAction, props } from '@ngrx/store';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { FileUploadData } from '@modules/infringement/ngrx/file-upload-data.interface';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/models/spreadsheet-upload-complete.response';
import { SpreadsheetUpsertCompleteResponse } from '@modules/infringement/dtos/spreadsheet-upsert-complete-response';
import { RedirectMissingInfringementsResponseDto } from '@modules/infringement/services/redirect-missing-infringements-response.dto';
import { Account } from '@modules/shared/models/entities/account.model';
import { BatchApproveInfringementDto } from '@modules/infringement/services/batch-approve-infringement.dto';

export const verifyInfringements = createAction('[Infringement Request] Verify Infringements', props<{ infringementIds: number[] }>());

export const verifyInfringement = createAction('[Infringement Request] Verify Single Infringement', props<{ infringementId: number }>());

export const infringementLoading = createAction('[Infringement] Loading', props<{ loading: boolean }>());

export const setIssuersInAdminInfringementUpload = createAction(
    `[Infringement] Set Issuers in Admin Infringement Upload`,
    props<{ issuers: Issuer[] }>(),
);

export const setAccountInAdminInfringementUpload = createAction(
    `[Infringement] Set Account in Admin Infringement Upload`,
    props<{ account: Account }>(),
);

export const setFileInAdminInfringementUpload = createAction(
    `[Infringement] Set File in Admin Infringement Upload`,
    props<{ files: File[] }>(),
);

export const setFileUploadDataInAdminInfringementUpload = createAction(
    `[Infringement] Set File Upload Data in Admin Infringement Upload`,
    props<{ uploadData: FileUploadData }>(),
);

export const setVerifyResponseInAdminInfringementUpload = createAction(
    `[Infringements] Set Verify Response in Admin Infringement Upload`,
    props<{ response: SpreadsheetUploadCompleteResponse }>(),
);

export const setUploadResponseInAdminInfringementUpload = createAction(
    `[Infringements] Set Upload Response in Admin Infringement Upload`,
    props<{ response: SpreadsheetUpsertCompleteResponse | SpreadsheetUploadCompleteResponse }>(),
);

export const redirectMissingInfringementsRequest = createAction(
    `[Infringements] Redirect Missing Infringements Request`,
    props<{ infringementIds: number[] }>(),
);

export const redirectMissingInfringementsRequestSuccess = createAction(
    `[Infringements] Redirect Missing Infringements Request Success`,
    props<{ response: RedirectMissingInfringementsResponseDto }>(),
);

export const redirectMissingInfringementsRequestFailed = createAction(
    `[Infringements] Redirect Missing Infringements Request Failed`,
    props<{ error: any }>(),
);

export const redirectMissingInfringementsSkipRedirections = createAction(
    `[Infringements] Redirect Missing Infringements Skip Redirections`,
);

export const redirectMissingInfringementsReset = createAction(`[Infringements] Redirect Missing Infringements Reset`);

export const approveInfringementReq = createAction('[Infringement Request] Approve Infringement', props<{ infringementId: number }>());
export const unapproveInfringementReq = createAction('[Infringement Request] Unapprove Infringement', props<{ infringementId: number }>());
export const batchApproveInfringementsReq = createAction(
    '[Infringement Request] Batch Approve Infringements',
    props<BatchApproveInfringementDto>(),
);
export const resetInfringementQueryParameters = createAction('[Infringement] Reset Query Params');
