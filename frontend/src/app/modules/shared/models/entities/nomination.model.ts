import { Timestamped } from '@modules/shared/models/timestamped';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document } from '@modules/shared/models/entities/document.model';
import * as moment from 'moment';
import { Moment } from 'moment';

export enum NominationStatus {
    Pending = 'Pending',
    Acknowledged = 'Acknowledged',
    InRedirectionProcess = 'In Redirection Process', // RENAME: InNominationProcess
    RedirectionRequestError = 'Redirection Request Error',
    Closed = 'Closed', // CLARIFY AS NOT APPLICABLE
    RedirectionCompleted = 'Redirection Completed', // RENAME: AppealApproved
    RedirectionError = 'Redirection Error',
    RedirectedToThirdParty= 'Redirected To Third Party',
}

export class NominationDetails {
    @IsString()
    @IsOptional()
    redirectionReason?: string;

    @IsString()
    @IsOptional()
    acknowledgedFor?: { [action: string]: boolean };
}

export enum NominationType {
    Digital = 'Digital',
    Municipal = 'Municipal',
}

export enum RedirectionType {
    Manual = 'Manual Email',
    ATG = 'ATG Integration',
    Upload = 'Manual Upload',
}

export class Nomination extends Timestamped {
    nominationId: number;
    status: NominationStatus;
    redirectionError: string | null;
    details: NominationDetails;
    type: NominationType;
    redirectionType: RedirectionType;

    @Transform((val) => (moment(val).isValid() ? moment(val) : null))
    paidDate?: Moment;

    @Transform((val) => (moment(val).isValid() ? moment(val) : null))
    nominationDate?: Moment;

    @Transform((val) => (moment(val).isValid() ? moment(val) : null))
    redirectedDate?: Moment;

    @Transform((val) => (moment(val).isValid() ? moment(val) : null))
    redirectionLetterSendDate?: Moment;

    @Type(() => Infringement)
    infringement?: Infringement;
    @Type(() => Account)
    account?: Account;
    @Type(() => Account)
    redirectedFrom?: Account;
    @Type(() => Account)
    redirectionTarget?: Account;
    @Type(() => Document)
    mergedDocument?: Document;
    @Type(() => Document)
    redirectionDocument: Document;

    lastStatusChangeDate: string;
    mergedDocumentUpdatedDate?: string;

    rawRedirectionIdentifier?: string;

    externalRedirectionReference?: string;
}
