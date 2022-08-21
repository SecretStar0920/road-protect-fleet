import { FleetManagerDetails } from '@modules/shared/models/entities/account.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { Location } from '@modules/shared/models/entities/location.model';
import { Nomination, RedirectionType } from '@modules/shared/models/entities/nomination.model';

export class RedirectionAddressDetails {
    streetName: string = null;
    streetNumber: string = null;
    streetCode: string = null;
    issuer: Issuer = null;

    // Status
    valid: boolean = true;
    message: string = 'Valid redirection details';

    location: Location;
}

export enum IssuerChannels {
    crawler = 'crawler',
    physicalMail = 'physical mail',
    email = 'email',
}
/**
 * Municipal Redirection Details
 * Dependencies:
 * @link @modules/shared/models/spreadsheet/unready-redirect-spreadsheet.model
 */
export class MunicipalRedirectionDetails {
    ready: boolean;
    type: RedirectionType;
    infringement: Partial<Infringement>;
    nomination: Partial<Nomination>;
    message?: string;
    redirectionChannel?: IssuerChannels;

    hasDriverContract?: boolean;

    hasValidStatus: {
        status: boolean;
        nominationStatus?: boolean;
        infringementStatus?: boolean;
    };
    hasLeaseDocument: {
        status: boolean;
        contractId: number;
    };
    hasLeaseSubstituteDocument: {
        status: boolean;
        contractId: number;
    };
    hasPowerOfAttorneyDocument: {
        status: boolean;
        accountId: number;
    };

    hasSignatureAvailable: {
        status: boolean;
        type: 'Natural' | 'RP'; // Either from the owner account or RP's
        details: FleetManagerDetails;
    };
   
    hasValidRedirectionUserAddress: {
        status: boolean;
        details: RedirectionAddressDetails;
    };

    hasValidRedirectionOwnerAddress: {
        status: boolean;
        details: RedirectionAddressDetails;
    };
}

export class BatchMunicipalRedirectionDetails {
    ready: {
        redirections: MunicipalRedirectionDetails[];
        summary?: any;
        redirectToDriver: number[];
    };
    unready: {
        redirections: MunicipalRedirectionDetails[];
        summary?: any;
    };
}
