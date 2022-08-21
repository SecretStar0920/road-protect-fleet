import {
    Contract,
    Document,
    InfringementApproval,
    InfringementLog,
    InfringementNote,
    Issuer,
    Log,
    Nomination,
    Notification,
    Payment,
    PhysicalLocation,
    TimeStamped,
    User,
    Vehicle,
} from '@entities';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { BigNumber } from 'bignumber.js';
import {
    BeforeInsert,
    BeforeUpdate,
    Brackets,
    Column,
    Entity,
    Index,
    JoinColumn, JoinTable, ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    SelectQueryBuilder,
    Unique,
} from 'typeorm';
import * as moment from 'moment';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { ApiProperty } from '@nestjs/swagger';

export enum InfringementStatus {
    Due = 'Due',
    Outstanding = 'Outstanding', // Has penalties, is overdue latest payment date or is under warning from muni
    Paid = 'Paid',
    Closed = 'Closed',
    ApprovedForPayment = 'Approved for Payment',
    Collection = 'Collection',
    Unmanaged = 'Unmanaged',
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

export enum InfringementCreationMethod {
    ExcelUpload = 'Excel Upload',
    User = 'User',
    Crawler = 'Crawler',
    PartialInfringement = 'Partial Infringement',
    Unknown = 'Unknown',
}


export enum InfringementTag {
    InLegalCare = 'InLegalCare',
    FollowUp = 'FollowUp',
    Overdue = 'Overdue'
}

export enum InfringementTagCodes {
    InLegalCare = 0,
    FollowUp = 1,
    Overdue = 2
}

const InfringementTagNameToCodeMap = new Map<InfringementTag, InfringementTagCodes>()
InfringementTagNameToCodeMap.set(InfringementTag.InLegalCare, InfringementTagCodes.InLegalCare)
InfringementTagNameToCodeMap.set(InfringementTag.FollowUp, InfringementTagCodes.FollowUp)
InfringementTagNameToCodeMap.set(InfringementTag.Overdue, InfringementTagCodes.Overdue)

const InfringementCodeToTagNameMap = new Map<InfringementTagCodes, InfringementTag>()
InfringementCodeToTagNameMap.set(InfringementTagCodes.InLegalCare, InfringementTag.InLegalCare)
InfringementCodeToTagNameMap.set(InfringementTagCodes.FollowUp, InfringementTag.FollowUp)
InfringementCodeToTagNameMap.set(InfringementTagCodes.Overdue, InfringementTag.Overdue)

export const INFRINGEMENT_CONSTRAINTS: IDatabaseConstraints = {
    noticeNumber: {
        keys: ['noticeNumber', 'issuer'],
        constraint: 'unique_issuer_notice_number',
        description: 'An infringement with this notice number already exists for this issuer',
    },
    noticeNumberVehicle: {
        keys: ['noticeNumber', 'vehicle'],
        constraint: 'unique_vehicle_notice_number',
        description: 'An infringement with this notice number already exists for this vehicle',
    },
};

@Entity()
@Unique(INFRINGEMENT_CONSTRAINTS.noticeNumber.constraint, INFRINGEMENT_CONSTRAINTS.noticeNumber.keys)
@Unique(INFRINGEMENT_CONSTRAINTS.noticeNumberVehicle.constraint, INFRINGEMENT_CONSTRAINTS.noticeNumberVehicle.keys)
export class Infringement extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    infringementId: number;

    // Fields

    @Column('text')
    @ApiProperty()
    noticeNumber: string;

    @Column('timestamptz')
    @Index()
    @ApiProperty()
    offenceDate: string;

    @Column('timestamptz')
    @Index()
    @ApiProperty()
    latestPaymentDate: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    reason: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    reasonCode: string;

    @Column('numeric', { precision: 12, scale: 2 })
    @Index()
    @ApiProperty()
    amountDue: string; // current amount owed

    @Column('numeric', { precision: 12, scale: 2 })
    @Index()
    @ApiProperty()
    originalAmount: string; // original amount

    @Column('numeric', { precision: 12, scale: 2 })
    @Index()
    @ApiProperty()
    totalAmount: string; // total amount owed whether paid or not

    @Column('numeric', { precision: 12, scale: 2, nullable: true })
    @Index()
    totalPayments: string; // total amount paid

    @Column('numeric', { precision: 12, scale: 2, nullable: true })
    @Index()
    @ApiProperty()
    penaltyAmount: string;

    @Column('enum', { enum: InfringementStatus, default: InfringementStatus.Due })
    @Index()
    @ApiProperty({ enum: InfringementSystemStatus, default: InfringementStatus.Due })
    status: InfringementStatus;

    @Column('text', { nullable: true, default: 'Unknown' })
    @ApiProperty()
    issuerStatus: string;

    @Column('text', { nullable: true, default: '' })
    @ApiProperty()
    issuerStatusDescription: string;

    @Column('enum', { enum: InfringementSystemStatus, default: InfringementSystemStatus.Valid })
    @ApiProperty({ enum: InfringementSystemStatus, default: InfringementSystemStatus.Valid })
    systemStatus: InfringementSystemStatus;

    @Column('text', { nullable: true })
    @ApiProperty()
    caseNumber: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    brn: string;

    @Column('timestamptz', { nullable: true })
    @Index('infringement_external_change_date_idx')
    @ApiProperty()
    externalChangeDate: string;

    @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty()
    lastStatusChangeDate: string;

    @Column('timestamptz', { nullable: true })
    @ApiProperty()
    @Index()
    approvedDate: string;

    @Column('enum', { enum: InfringementCreationMethod, default: InfringementCreationMethod.Unknown })
    @ApiProperty({ enum: InfringementCreationMethod, default: InfringementCreationMethod.Unknown })
    creationMethod: InfringementCreationMethod;

    /**
     * Marks the external change date to now and returns the infringement for
     * saving.
     */
    markAsExternalChange(): Infringement {
        this.externalChangeDate = moment().toISOString();
        return this;
    }

    @Column('enum', { enum: InfringementType, nullable: true })
    @ApiProperty({ enum: InfringementType })
    type: InfringementType;
    // Relations

    @OneToOne((type) => Payment, (payment) => payment.successfulInfringement)
    @ApiProperty({ type: 'object', description: 'Payment' })
    lastSuccessfulPayment: Payment;

    @ManyToOne((type) => Vehicle, (vehicle) => vehicle.infringements, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'vehicleId', referencedColumnName: 'vehicleId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Vehicle' })
    vehicle: Vehicle;

    @ManyToOne((type) => Contract, (contract) => contract.infringements, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'contractId', referencedColumnName: 'contractId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Contract' })
    contract: Contract;

    @ManyToOne((type) => Issuer, (issuer) => issuer.infringements, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'issuerId', referencedColumnName: 'issuerId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Issuer' })
    issuer: Issuer;

    @OneToOne((type) => Nomination, (nomination) => nomination.infringement)
    @ApiProperty({ type: 'object', description: 'Nomination' })
    nomination: Nomination;

    @OneToMany((type) => Payment, (payment) => payment.infringement)
    @ApiProperty({ type: 'object', description: 'Payment[]' })
    payments: Payment[];

    @OneToMany((type) => Log, (log) => log.infringement)
    @ApiProperty({ type: 'object', description: 'Log[]' })
    logs: Log[];

    // This column is managed by triggers on the account and contract tables
    // Which check if a document is deleted or added and update this status accordingly
    // If it's not working in development, it is because the triggers are not created via db sync. They are created via migrations.
    // Manually execute the trigger from the migrations file to verify functionality
    // @Column('bool', { default: false })
    // hasRedirectionDocumentation: boolean;

    @OneToMany((type) => Notification, (notification) => notification.infringement)
    @ApiProperty({ description: 'Notification[]' })
    notifications: Notification[];

    @OneToOne((type) => Document, (document) => document.infringement)
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @ApiProperty({ type: 'object', description: 'Document' })
    document: Document;

    @ManyToMany((type) => Document, (document) => [], { eager: true })
    @JoinTable({ name: 'infringement_extra_document' })
    @ApiProperty({ type: 'object', description: 'Document[]' })
    extraDocuments: Document[];

    @OneToOne((type) => PhysicalLocation, (location) => location.infringement, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'locationId', referencedColumnName: 'locationId' })
    @ApiProperty({ type: 'object', description: 'PhysicalLocation' })
    location: PhysicalLocation;

    @OneToMany((type) => InfringementLog, (infringementLog) => infringementLog.infringement)
    @ApiProperty({ type: 'object', description: 'InfringementLog[]' })
    infringementLogs: InfringementLog[];

    @OneToMany((type) => InfringementNote, (note) => note.infringement)
    @ApiProperty({ type: 'object', description: 'InfringementNote[]' })
    notes: InfringementNote[];

    @OneToMany(() => InfringementRevisionHistory, (infringementRevisionHistory) => infringementRevisionHistory.infringement)
    @ApiProperty({ type: 'object', description: 'InfringementRevisionHistory[]' })
    infringementRevisionHistory: InfringementRevisionHistory[];

    @OneToMany((type) => InfringementApproval, (infringementApproval) => infringementApproval.infringement)
    @ApiProperty({ type: 'object', description: 'InfringementApproval' })
    infringementApproval: InfringementApproval[];

    // Stores the user that created the infringement
    @ManyToOne((type) => User, (user) => user.infringement, { nullable: true })
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    @ApiProperty({ type: 'object', description: 'User' })
    user: User;

    static findByNoticeNumberAndIssuer(noticeNumber: string, issuerNameOrCode: string | number): SelectQueryBuilder<Infringement> {
        const query = this.findWithMinimalRelations()
            .andWhere('infringement.noticeNumber = :noticeNumber', { noticeNumber })
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('issuer.name = :issuerName', { issuerName: issuerNameOrCode });
                    qb.orWhere('issuer.code = :issuerName', { issuerName: issuerNameOrCode });
                }),
            );

        return query;
    }

    static findByNoticeNumberAndIssuerId(noticeNumber: string, issuerId: string | number): SelectQueryBuilder<Infringement> {
        const query = this.findWithMinimalRelations()
            .andWhere('infringement.noticeNumber = :noticeNumber', { noticeNumber })
            .andWhere( 'issuer.issuerId = :issuerId', {issuerId});

        return query;
    }
    static findWithMinimalRelations(): SelectQueryBuilder<Infringement> {
        return (
            this.createQueryBuilder('infringement')
                .leftJoin('infringement.user', 'creationUser')
                .addSelect(['creationUser.email'])
                // Issuer
                .leftJoin('infringement.issuer', 'issuer')
                .addSelect(['issuer.name', 'issuer.issuerId', 'issuer.code', 'issuer.provider'])
                // Vehicle
                .leftJoin('infringement.vehicle', 'vehicle')
                .addSelect(['vehicle.registration', 'vehicle.vehicleId', 'vehicle.autoAssignTo', 'vehicle.type'])
                // Nomination
                .leftJoinAndSelect('infringement.nomination', 'nomination')
                // Nomination Account
                .leftJoin('nomination.account', 'account')
                .addSelect(['account.name', 'account.accountId', 'account.identifier'])
                // Document
                .leftJoinAndSelect('account.powerOfAttorney', 'powerOfAttorney')
                .leftJoinAndSelect('infringement.document', 'document')
                // Infringement contract
                .leftJoinAndSelect('infringement.contract', 'infringementContract')
                .leftJoin('infringementContract.user', 'contractUser')
                .addSelect(['contractUser.name', 'contractUser.accountId', 'contractUser.identifier'])
                .leftJoin('infringementContract.owner', 'contractOwner')
                .addSelect(['contractOwner.name', 'contractOwner.accountId', 'contractOwner.identifier'])
                .leftJoinAndSelect('infringementContract.document', 'leaseContractDocument')
                // Payment
                .leftJoinAndSelect('infringement.payments', 'payment')
                .leftJoinAndSelect('infringement.lastSuccessfulPayment', 'lastSuccessfulPayment')
                // Infringement location
                .leftJoinAndSelect('infringement.location', 'location')
                .leftJoinAndSelect('infringement.notes', 'notes')
                // .addOrderBy('notes.infringementNoteId', 'DESC')
                .leftJoinAndSelect('infringement.infringementApproval', 'infringement_approval')
                .leftJoinAndSelect('infringement_approval.account', 'infringement_approval_account')
                .leftJoinAndSelect('infringement_approval.user', 'infringement_approval_user')
                .leftJoinAndSelect('infringement.extraDocuments', 'extraDocuments')
        );
    }

    static findWithMinimalRelationsAndAccounts(): SelectQueryBuilder<Infringement> {
        return this.findWithMinimalRelations()
            .leftJoin('infringementContract.user', 'user')
            .addSelect(['user.name', 'user.accountId'])
            .leftJoin('infringementContract.owner', 'owner')
            .addSelect(['owner.name', 'owner.accountId'])
            .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .leftJoin('currentLeaseContract.user', 'vehicle_user')
            .addSelect(['user.name', 'user.accountId'])
            .leftJoin('currentLeaseContract.owner', 'vehicle_owner')
            .addSelect(['owner.name', 'owner.accountId']);
    }

    static findOutstanding() {
        return (
            this.createQueryBuilder('infringement')
                // Asked to remove check for latest payment date to move to outstanding on the 27th of October
                // .andWhere('infringement.latestPaymentDate <= :now::date', { now: moment().toISOString() })
                .andWhere('infringement.penaltyAmount > 0')
                .andWhere('infringement.status = :status', { status: InfringementStatus.Due })
        );
    }

    static findInvalidOutstanding() {
        return this.createQueryBuilder('infringement')
            .andWhere('infringement.penaltyAmount = 0')
            .andWhere('infringement.status = :status', { status: InfringementStatus.Outstanding });
    }

    static findUnpaid() {
        const unpaidStatuses = [InfringementStatus.Due, InfringementStatus.Outstanding];
        return this.createQueryBuilder('infringement').andWhere('infringement.status in (:...unpaidStatuses)', {
            unpaidStatuses,
        });
    }

    static findRedirected() {
        const redirectionStatuses = [NominationStatus.InRedirectionProcess];
        return this.createQueryBuilder('infringement')
            .leftJoin('infringement.nomination', 'nomination')
            .andWhere('nomination.status in (:...redirectionStatuses)', {
                redirectionStatuses,
            });
    }

    static findByIdWithPaymentRelations(infringementId: number) {
        return (
            this.createQueryBuilder('infringement')
                // Issuer
                .leftJoinAndSelect('infringement.issuer', 'issuer')
                // Vehicle
                .leftJoin('infringement.vehicle', 'vehicle')
                .addSelect(['vehicle.registration'])
                // Nomination
                .leftJoinAndSelect('infringement.nomination', 'nomination')
                // Payment
                .leftJoinAndSelect('infringement.payments', 'payments')
                .andWhere('infringement.infringementId = :infringementId', { infringementId })
                .getOne()
        );
    }

    static findById(infringementId: number) {
        return this.findWithMinimalRelations()
            .where('infringement.infringementId = :infringementId', {
                infringementId,
            })
            .limit(1)
            .getOne();
    }

    static findByNoticeNumber(noticeNumber: string) {
        return this.findWithMinimalRelations()
            .where('infringement.noticeNumber = :noticeNumber', {
                noticeNumber,
            })
            .limit(1)
            .getOne();
    }

    @BeforeInsert()
    @BeforeUpdate()
    async updateTotalAmount() {
        const currentMaxAmount = this.amountDue >= this.originalAmount ? this.amountDue : this.originalAmount;

        if (!this.totalAmount || new BigNumber(currentMaxAmount).isGreaterThan(this.totalAmount)) {
            this.totalAmount = currentMaxAmount;
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    private async updateTotalPayments() {
        if (!this.payments || this.payments.length < 1) {
            this.totalPayments = new BigNumber(0).toFixed(2);
            return;
        }
        const total = this.payments.reduce((sum, current) => {
            if (!current.amountPaid) {
                return sum;
            }
            const amountPaid = current.amountPaid.includes(',') ? current.amountPaid.replace(',', '') : current.amountPaid;
            return new BigNumber(sum).plus(amountPaid).toFixed(2);
        }, '0');
        this.totalPayments = new BigNumber(total).toFixed(2);
    }

    @BeforeInsert()
    @BeforeUpdate()
    private async updatePenaltyAmount() {
        await this.updateTotalPayments();
        const paid = +this.totalPayments;
        const due = +this.amountDue;
        const origin = +this.originalAmount;

        if (paid !== 0) {
            this.penaltyAmount = new BigNumber(due).plus(paid).minus(origin).toFixed(2);
        } else {
            if (origin > due) {
                this.penaltyAmount = new BigNumber(due).toFixed(2);
            } else {
                this.penaltyAmount = new BigNumber(due).minus(origin).toFixed(2);
            }
        }
        if (new BigNumber(this.penaltyAmount).isNegative()) {
            this.penaltyAmount = new BigNumber(0).toFixed(2);
        }
    }
}

@Entity()
/**
 * Created automatically from the trigger, please see migrations for the trigger
 */
export class InfringementRevisionHistory {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    infringementHistoryId: number;

    @Column('int')
    @Index()
    @ApiProperty()
    infringementId: number;

    @Column('enum', { enum: ['INSERT', 'UPDATE', 'DELETE'] })
    @ApiProperty({ enum: ['INSERT', 'UPDATE', 'DELETE'] })
    action: 'INSERT' | 'UPDATE' | 'DELETE';

    @Column('jsonb', { nullable: true })
    @ApiProperty()
    old: any;

    @Column('jsonb', { nullable: true })
    @ApiProperty()
    new: any;

    @Column('timestamptz')
    @ApiProperty()
    timestamp: string;

    @ManyToOne(() => Infringement, (infringement) => infringement.infringementRevisionHistory)
    @JoinColumn({
        name: 'infringementId',
        referencedColumnName: 'infringementId',
    })
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;
}

/**
 * DO NOT REMOVE
 * Created to be used for filtering on metabase
 */
@Entity()
export class TypeMapper {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    infringementTypeMapperId: number;

    @Column('text', { nullable: false })
    @ApiProperty()
    infringementTypeInText: string;

    @Column('text', { nullable: false })
    @ApiProperty()
    infringementTypeDisplay: string;

    @Column('enum', { enum: InfringementType, nullable: false })
    @JoinColumn({ name: 'type', referencedColumnName: 'type' })
    @ApiProperty({ enum: InfringementType })
    infringementType: InfringementType;
}
