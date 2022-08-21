import { createAction, props } from '@ngrx/store';
import { DigitalRedirectionDto } from '@modules/nomination/services/digital-redirection.dto';
import { ManualPayNominationDto } from '@modules/nomination/services/manual-pay-nomination.dto';
import { BatchApproveNominationDto } from '@modules/nomination/services/batch-approve-nomination.dto';
import { BatchDigitallyRedirectNominationDto } from '@modules/nomination/services/batch-digitally-redirect-nomination.dto';
import { AcknowledgeNominationDto } from '@modules/nomination/services/acknowledge-nomination.dto';
import { BatchAcknowledgeNominationDto } from '@modules/nomination/services/batch-acknowledge-nomination.dto';
import { UpdateRedirectionStatusDto } from '@modules/nomination/services/update-redirection-status.dto';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { IBatchPaymentResult } from '@modules/nomination/services/nomination.service';
import { IBatchRedirectionsResult } from '@modules/nomination/components/batch-municipally-redirect-nominations/batch-municipally-redirection-nominations.component';
import { IBatchDigitalRedirectionsResult } from '@modules/nomination/components/batch-digitally-redirect-nominations/batch-digitally-redirection-nominations.component';
// Custom actions

export const getNominationsForAccountReq = createAction('[Nomination Request] Get Nominations for Account', props<{ accountId: number }>());
export const getNominationsForInfringementReq = createAction(
    '[Nomination Request] Get Nominations for Infringement',
    props<{ infringementId: number }>(),
);
export const redirectNominationReq = createAction(
    '[Nomination Request] Redirect Nomination',
    props<{ nominationId: number; dto: DigitalRedirectionDto }>(),
);
export const updateRedirectionStatusReq = createAction(
    '[Nomination Request] Update Redirection Status',
    props<{ nominationId: number; dto: UpdateRedirectionStatusDto }>(),
);

export const generateRedirectionDocumentReq = createAction(
    '[Nomination Request] Generate Redirection Document',
    props<{ nominationId: number }>(),
);
export const acknowledgeNominationReq = createAction(
    '[Nomination Request] Acknowledge Nomination',
    props<{ nominationId: number; dto: AcknowledgeNominationDto }>(),
);
export const unapproveNominationReq = createAction('[Nomination Request] Unapprove Nomination', props<{ nominationId: number }>());
export const batchMunicipalPayNominationReq = createAction(
    '[Nomination Request] Batch Pay Municipal Nomination',
    props<{ payableIds: number[]; cvvValue: any }>(),
);
export const batchMunicipalPayNominationReqSuccess = createAction(
    `[Nomination Request] Batch Pay Municipal Nominations Success`,
    props<{ result: IBatchPaymentResult }>(),
);
export const batchMunicipalRedirectNominationReqSuccess = createAction(
    '[Nomination Request] Batch Redirect Municipal Nomination Success',
    props<{ result: IBatchRedirectionsResult }>(),
);
export const batchAcknowledgeNominationReq = createAction(
    '[Nomination Request] Batch Acknowledge Nominations',
    props<BatchAcknowledgeNominationDto>(),
);
export const batchDigitalRedirectionReq = createAction(
    '[Nomination Request] Batch Digitally Redirect Nominations',
    props<BatchDigitallyRedirectNominationDto>(),
);
export const batchDigitalRedirectionNominationReqSuccess = createAction(
    '[Nomination Request] Batch Digitally Redirect Nominations Success',
    props<{ result: IBatchDigitalRedirectionsResult }>(),
);
export const batchMunicipalRedirectNominationReq = createAction(
    '[Nomination Request] Batch Redirect Municipal Nominations',
    props<{ nominationsIds: number[] }>(),
);
export const nominationLoading = createAction('[Nomination] Loading', props<{ loading: boolean }>());
export const manualPayNominationReq = createAction(
    '[Nomination Request] Manual Pay Nomination',
    props<{ nominationId: number; dto: ManualPayNominationDto }>(),
);
export const municipalPayNominationReq = createAction(
    '[Nomination Request] Municipal Pay Nomination',
    props<{ nominationId: number; cvv: any }>(),
);
