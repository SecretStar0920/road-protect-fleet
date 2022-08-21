import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, SelectQueryBuilder, Unique } from 'typeorm';
import {
    AccountRelation,
    AccountUser,
    AuditLog,
    CreditGuardToken,
    Document,
    InfringementApproval,
    InfringementNote,
    LeaseContract,
    Log,
    Nomination,
    Notification,
    OwnershipContract,
    PhysicalLocation,
    PostalLocation,
    TimeStamped,
} from '@entities';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { IsDefined, IsOptional } from 'class-validator';
import { RequestInformationLog } from '@modules/shared/entities/request-information-log.entity';
import { ApiProperty } from '@nestjs/swagger';

export const ACCOUNT_CONSTRAINTS: IDatabaseConstraints = {
    name: {
        keys: ['name'],
        constraint: 'unique_account_name',
        description: 'An account with this name already exists',
    },
    identifier: {
        keys: ['identifier'],
        constraint: 'unique_identifier',
        description: 'An account with this identifier already exists',
    },
};

export enum AccountType {
    Individual = 'Individual',
    Standard = 'Standard',
}

export enum AccountRole {
    Owner = 'Owner', // Mainly manages vehicles they own to see who is using them
    User = 'User', // Mainly rents vehicles
    // Driver = 'Driver', // Mainly the driver of vehicles
    Hybrid = 'Hybrid', // Hybrid, does all/some of the above
}

export class AccountDetails {
    @IsOptional()
    @ApiProperty()
    name?: string;
    @IsOptional()
    @ApiProperty()
    telephone?: string;
    @IsOptional()
    @ApiProperty()
    fax?: string;
    @IsOptional()
    @ApiProperty()
    reportingEmbedUrl?: string;
}

export class InfringementReportEmailCustomisation {
    @ApiProperty()
    ccAddress?: string[];
    @ApiProperty()
    customSignature?: string;
    @ApiProperty()
    emailBody?: string;
}

export class AccountReporting {
    @ApiProperty()
    receiveWeeklyReport?: boolean;
    @ApiProperty({ type: 'object', description: 'InfringementReportEmailCustomisation' })
    forwardRelationReportingTemplate?: InfringementReportEmailCustomisation;
    @ApiProperty()
    ccAddress?: string[];
    @ApiProperty()
    customSignature?: string;
    @ApiProperty()
    emailBody?: string;
}

export class AccountMetabaseReporting {
    @ApiProperty()
    customCollections: number[];
}

export class RequestInformationDetails {
    @ApiProperty()
    canSendRequest: boolean;
    @ApiProperty()
    senderName: string;
    @ApiProperty()
    senderRole: string;
}

export class FleetManagerDetails {
    @IsDefined()
    @ApiProperty()
    name: string;
    @IsDefined()
    @ApiProperty()
    signatureSvg: string;
    @IsDefined()
    @ApiProperty()
    logo: string;
    @IsDefined()
    @ApiProperty()
    id: string;
    @IsOptional()
    @ApiProperty()
    vehicleOfficerSignature?: string;
}

@Entity()
@Unique(ACCOUNT_CONSTRAINTS.name.constraint, ACCOUNT_CONSTRAINTS.name.keys)
@Unique(ACCOUNT_CONSTRAINTS.identifier.constraint, ACCOUNT_CONSTRAINTS.identifier.keys)
export class Account extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    accountId: number;

    @Column('text', { nullable: true })
    @Index({ unique: true })
    @ApiProperty()
    identifier: string; // registration number BRN

    @Column('text', { nullable: true })
    @ApiProperty()
    name: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    primaryContact: string; // FIXME: temporary for who to contact on behalf of this account

    @Column('bool', { default: true })
    @ApiProperty()
    active: boolean;

    @Column('bool', { default: false })
    @ApiProperty()
    isVerified: boolean;

    @Column('enum', { enum: AccountType, default: AccountType.Standard })
    @ApiProperty({ enum: AccountType, default: AccountType.Standard })
    type: AccountType;

    @Column('enum', { enum: AccountRole, default: AccountRole.Hybrid })
    @ApiProperty({ enum: AccountRole, default: AccountRole.Hybrid })
    role: AccountRole;

    @Column('jsonb', { default: {} })
    @ApiProperty({ type: () => AccountDetails, default: {}, title: 'AccountDetails' })
    details: AccountDetails;

    @Column('bool', { default: false })
    @ApiProperty()
    managed: boolean;

    @Column('jsonb', { nullable: true })
    @ApiProperty({ type: 'object', description: 'AccountReporting', title: 'AccountReporting' })
    accountReporting: AccountReporting;

    @Column('jsonb', { nullable: true })
    @ApiProperty({ type: 'object', description: 'AccountMetabaseReporting', title: 'AccountMetabaseReporting' })
    accountMetabaseReporting: AccountMetabaseReporting;

    @Column('jsonb', { nullable: true, select: false })
    @ApiProperty({ type: 'object', description: 'FleetManagerDetails', title: 'FleetManagerDetails' })
    fleetManagerDetails: FleetManagerDetails;

    @Column('jsonb', { nullable: true })
    @ApiProperty({ type: 'object', description: 'RequestInformationDetails', title: 'RequestInformationDetails' })
    requestInformationDetails: RequestInformationDetails;

    @OneToOne((type) => PhysicalLocation, (location) => location.accountPhysical, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'physicalLocationId', referencedColumnName: 'locationId' })
    @ApiProperty({ type: 'object', description: 'PhysicalLocation', title: 'PhysicalLocation' })
    physicalLocation: PhysicalLocation;

    @OneToOne((type) => PostalLocation, (location) => location.accountPostal, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'postalLocationId', referencedColumnName: 'locationId' })
    @ApiProperty({ type: 'object', description: 'PostalLocation' })
    postalLocation: PostalLocation;

    @OneToOne((type) => Document, (document) => document.account, { nullable: true, eager: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @ApiProperty({ type: 'object', description: 'Document' })
    powerOfAttorney: Document;

    @OneToMany((type) => AccountUser, (accountUser) => accountUser.account)
    @ApiProperty({ type: 'object', description: 'AccountUser[]' })
    users: AccountUser[];

    // Payment tokens
    @OneToOne((type) => CreditGuardToken, (token) => token.accountAtg, { nullable: true })
    @JoinColumn({ name: 'atgTokenId', referencedColumnName: 'creditGuardTokenId' })
    @ApiProperty({ type: 'object', description: 'CreditGuardToken' })
    atgCreditGuard: CreditGuardToken;

    @OneToOne((type) => CreditGuardToken, (token) => token.accountRp, { nullable: true })
    @JoinColumn({ name: 'rpTokenId', referencedColumnName: 'creditGuardTokenId' })
    @ApiProperty({ type: 'object', description: 'CreditGuardToken' })
    rpCreditGuard: CreditGuardToken;

    // Contracts
    @OneToMany((type) => LeaseContract, (vehicle) => vehicle.user)
    @ApiProperty({ type: 'object', description: 'LeaseContract[]' })
    asUser: LeaseContract[]; // rented vehicles

    @OneToMany((type) => OwnershipContract, (owner) => owner.owner)
    @ApiProperty({ type: 'object', description: 'OwnershipContract[]' })
    asOwner: OwnershipContract[]; // owned or leasing vehicles

    // Nominations
    @OneToMany((type) => Nomination, (nomination) => nomination.account)
    @ApiProperty({ type: 'object', description: 'Nomination[]' })
    nominations: Nomination[];

    @OneToMany((type) => Nomination, (nomination) => nomination.redirectedFrom)
    @ApiProperty({ type: 'object', description: 'Nomination[]' })
    previouslyNominated: Nomination[];

    @OneToMany((type) => Nomination, (nomination) => nomination.redirectionTarget)
    @ApiProperty({ type: 'object', description: 'Nomination[]' })
    toBeNominated: Nomination[];

    @OneToMany((type) => Notification, (notification) => notification.account)
    @ApiProperty({ type: 'object', description: 'Notification' })
    notifications: Notification[];

    // Logs
    @OneToMany((type) => Log, (log) => log.account)
    @ApiProperty()
    @ApiProperty({ type: 'object', description: 'Log' })
    logs: Log[];

    @OneToMany((type) => AuditLog, (auditLog) => auditLog.forAccount)
    @ApiProperty()
    @ApiProperty({ type: 'object', description: 'AuditLog' })
    userAuditLogs: AuditLog[];

    @OneToMany((type) => RequestInformationLog, (informationLRequestLog) => informationLRequestLog.senderAccount)
    @ApiProperty({ type: 'object', description: 'RequestInformationLog' })
    accountRequestInformationLog: RequestInformationLog[];

    @OneToMany((type) => InfringementNote, (note) => note.createdBy)
    @ApiProperty({ type: 'object', description: 'RequestInformationLog' })
    infringementNotes: InfringementNote[];

    // Relations
    @OneToMany((type) => AccountRelation, (relation) => relation.forward)
    @ApiProperty({ type: 'object', description: 'AccountRelation[]' })
    forwardRelations: AccountRelation[];

    @OneToMany((type) => AccountRelation, (relation) => relation.reverse)
    @ApiProperty({ type: 'object', description: 'AccountRelation[]' })
    reverseRelations: AccountRelation[];

    @OneToMany((type) => InfringementApproval, (infringementApproval) => infringementApproval.account)
    @ApiProperty({ type: 'object', description: 'InfringementApproval[]' })
    infringementApproval: InfringementApproval[];

    static findWithMinimalRelations(): SelectQueryBuilder<Account> {
        return this.createQueryBuilder('account')
            .leftJoinAndSelect('account.powerOfAttorney', 'powerOfAttorney')
            .leftJoinAndSelect('account.physicalLocation', 'location')
            .leftJoinAndSelect('account.postalLocation', 'postalLocation');
    }

    static findWithMinimalRelationsAndTokens() {
        return this.findWithMinimalRelations()
            .leftJoinAndSelect('account.atgCreditGuard', 'atgToken')
            .leftJoinAndSelect('account.rpCreditGuard', 'rpToken')
            .addSelect(['atgToken.raw', 'rpToken.raw']);
    }

    static async findByIdentifierOrId(identifier: string): Promise<Account> {
        let query = this.getRepository()
            .createQueryBuilder('account')
            .leftJoinAndSelect('account.physicalLocation', 'location')
            .leftJoinAndSelect('account.postalLocation', 'postalLocation')
            .select(['account.name', 'account.accountId', 'account.identifier', 'account.createdAt'])
            .andWhere('account.identifier = :identifier', { identifier });

        query = this.addAccountIdCondition(identifier, query)
        return query.getOne();
    }

    static async findOneByIdOrNameOrIdentifierMinimal(idOrName: string | number): Promise<Account> {
        let query = this.getRepository()
            .createQueryBuilder('account')
            .select(['account.name', 'account.accountId'])
            .andWhere('account.name = :idOrName', { idOrName })
            .orWhere('account.identifier = :idOrName', { idOrName });

        query = this.addAccountIdCondition(idOrName, query)
        return query.getOne();
    }

    static async findOneByIdOrNameOrIdentifier(idOrName: string | number): Promise<Account> {
        let query = this.getRepository()
            .createQueryBuilder('account')
            .andWhere('account.name = :idOrName', { idOrName })
            .orWhere('account.identifier = :idOrName', { idOrName });

        query = this.addAccountIdCondition(idOrName, query)
        return query.getOne();
    }

    private static addAccountIdCondition(value: any, query: SelectQueryBuilder<Account>): SelectQueryBuilder<Account> {
        const accountId = this.convertToAccountIdentifier(value);
        if (accountId !== undefined) {
            return query.orWhere('account.accountId = :idOrName', { idOrName: accountId });
        }

        return query
    }

    private static convertToAccountIdentifier(value: any): number | undefined {
        const accountIdentifier = Number(value)
        if (isNaN(accountIdentifier)) {
            return undefined
        }

        const maxValue = Math.pow( 2, 31 ) - 1
        if (accountIdentifier > maxValue) {
            return undefined
        }

        return accountIdentifier;
    }
}

@Entity()
export class AccountRevisionHistory {
    @PrimaryGeneratedColumn()
    accountHistoryId: number;

    @Column('int')
    @Index()
    accountId: number;

    @Column('enum', { enum: ['INSERT', 'UPDATE', 'DELETE'] })
    action: 'INSERT' | 'UPDATE' | 'DELETE';

    @Column('jsonb', { nullable: true })
    old: any;

    @Column('jsonb', { nullable: true })
    new: any;

    @Column('timestamptz')
    timestamp: string;
}
