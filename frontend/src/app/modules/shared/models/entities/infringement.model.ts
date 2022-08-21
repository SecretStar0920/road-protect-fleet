import { Timestamped } from '@modules/shared/models/timestamped';
import { Transform, Type } from 'class-transformer';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Document } from '@modules/shared/models/entities/document.model';
import { PhysicalLocation } from '@modules/shared/models/entities/location.model';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { Payment } from '@modules/shared/models/entities/payment.model';
import { momentTransform } from '@modules/shared/transforms/moment.transform';
import { InfringementApproval } from '@modules/shared/models/entities/infringement-approval.model';

export enum InfringementStatus {
    Due = 'Due',
    Outstanding = 'Outstanding', // Has penalties, is overdue latest payment date or is under warning from muni
    Paid = 'Paid',
    Closed = 'Closed',
    ApprovedForPayment = 'Approved for Payment',
    Collection = 'Collection',
    Unmanaged= 'Unmanaged',
}

export enum InfringementTag {
    InLegalCare = 'InLegalCare',
    FollowUp = 'FollowUp',
    Overdue = 'Overdue'
}

export enum InfringementSystemStatus {
    MissingContract = 'Missing Contract',
    MissingVehicle = 'Missing Vehicle',
    Valid = 'Valid',
}

export enum InfringementType {
    Parking = 'Parking',
    Traffic = 'Traffic',
    Environmental = 'Environmental',
    Other = 'Other',
}

export class Infringement extends Timestamped {
    infringementId: number;
    noticeNumber: string;

    @Transform((val) => momentTransform(val))
    offenceDate: Moment;
    @Transform((val) => momentTransform(val))
    latestPaymentDate: Moment;

    reason: string;
    reasonCode: string;

    amountDue: string;
    originalAmount: string;
    penaltyAmount: string;
    totalPayments: string;

    status: InfringementStatus;
    issuerStatus: string;
    issuerStatusDescription: string;
    systemStatus: InfringementSystemStatus;
    type: InfringementType;

    caseNumber: string;

    brn: string;

    lastStatusChangeDate: string;

    tags: InfringementTag[];

    @Transform((val) => (moment(val).isValid() ? moment(val) : null))
    approvedDate?: Moment;

    @Transform((val) => momentTransform(val))
    externalChangeDate: Moment;

    @Type(() => Vehicle)
    vehicle: Vehicle;

    @Type(() => Contract)
    contract: Contract;

    @Type(() => Payment)
    payments: Payment[];

    @Type(() => Issuer)
    issuer: Issuer;
    @Type(() => Nomination)
    nomination: Nomination;
    @Type(() => Document)
    document: Document;

    @Type(() => Document)
    extraDocuments: Document[];

    @Type(() => PhysicalLocation)
    location: PhysicalLocation;

    @Type(() => InfringementApproval)
    infringementApproval: InfringementApproval[];
}
