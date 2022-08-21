import { Type } from 'class-transformer';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { Timestamped } from '@modules/shared/models/timestamped';
import { AccountType } from '@modules/shared/models/entities/account-type.enum';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Document } from '@modules/shared/models/entities/document.model';
import { PhysicalLocation, PostalLocation } from '@modules/shared/models/entities/location.model';
import { Contract } from '@modules/shared/models/entities/contract.model';

export enum AccountRole {
    Owner = 'Owner', // Mainly manages vehicles they own to see who is using them
    User = 'User', // Mainly rents vehicles
    // Driver = 'Driver', // Mainly the driver of vehicles
    Hybrid = 'Hybrid', // Hybrid, does all/some of the above
}

export class FleetManagerDetails {
    name: string;
    signatureSvg: string;
    id: string;
}

export class RequestInformationDetails {
    canSendRequest: boolean;
    senderName: string;
    senderRole: string;
}

export class AccountDetails {
    name?: string;
    telephone?: string;
    fax?: string;
    reportingEmbedUrl?: string;
}

export class CreditGuardToken {
    creditGuardTokenId: number;
    cardToken?: string;
    cardExp?: string;
    cardMask?: string;
    cardHolderId?: string;
    raw: any;
    active: boolean;
}

export class Account extends Timestamped {
    accountId: number;
    name: string;
    identifier: string;
    active: boolean;
    isVerified: boolean;
    type: AccountType;
    primaryContact: string;
    details: AccountDetails;
    role: AccountRole;
    managed: boolean;
    notifications: any;

    @Type(() => FleetManagerDetails)
    fleetManagerDetails: FleetManagerDetails;

    @Type(() => RequestInformationDetails)
    requestInformationDetails: RequestInformationDetails;

    @Type(() => CreditGuardToken)
    atgCreditGuard: CreditGuardToken;
    @Type(() => CreditGuardToken)
    rpCreditGuard: CreditGuardToken;

    @Type(() => PhysicalLocation)
    physicalLocation: PhysicalLocation;

    @Type(() => PostalLocation)
    postalLocation: PostalLocation;

    @Type(() => AccountUser)
    users: AccountUser[];

    @Type(() => Contract)
    asUser: Contract;

    @Type(() => Contract)
    asOwner: Contract;

    @Type(() => Nomination)
    nominations: Nomination[];

    @Type(() => Document)
    powerOfAttorney: Document;
}
