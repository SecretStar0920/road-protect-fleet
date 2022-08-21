import { Timestamped } from '@modules/shared/models/timestamped';
import { Transform, Type } from 'class-transformer';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { IssuerDetails } from '@modules/shared/models/entities/issuer-details.model';
import { Moment } from 'moment';
import { momentTransform } from '@modules/shared/transforms/moment.transform';
import { IssuerIntegrationDetailsModel } from '@modules/shared/models/entities/issuer-integration-details.model';

export enum IssuerType {
    Municipal = 'Municipal',
    Regional = 'Regional',
    Local = 'Local',
}

export enum IssuerProviderType {
    None = 'None',
    ATG = 'ATG',
    Jerusalem = 'Jerusalem',
    Telaviv = 'Telaviv',
    Mileon = 'Mileon',
    Metropark = 'Metropark',
    KfarSaba = 'KfarSaba',
    Police = 'Police',
    Shohar = 'Shohar',
    City4u = 'City4u',
}

export class Issuer extends Timestamped {
    issuerId: number;
    name: string;
    code: string;
    type: IssuerType;
    address: string;
    email: string;
    fax: string;
    telephone: string;
    contactPerson: string;
    redirectionEmail: string;
    externalPaymentLink: string;
    @Transform((val) => momentTransform(val))
    latestInfoDate: Moment;

    @Type(() => Issuer)
    localities: Issuer[];
    @Type(() => Issuer)
    authority: Issuer;

    @Type(() => IssuerDetails)
    details: IssuerDetails;

    @Type(() => IssuerIntegrationDetailsModel)
    integrationDetails: IssuerIntegrationDetailsModel;

    @Type(() => Infringement)
    infringements: Infringement[];
}
