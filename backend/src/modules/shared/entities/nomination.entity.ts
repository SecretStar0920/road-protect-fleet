import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    SelectQueryBuilder,
} from 'typeorm';
import { Account, Document, Infringement, TimeStamped } from '@entities';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { ApiProperty } from '@nestjs/swagger';
import { includes } from 'lodash';

export class NominationDetails {
    @IsString()
    @IsOptional()
    @Expose()
    @ApiProperty()
    redirectionReason?: string;

    @IsString()
    @IsOptional()
    @Expose()
    @ApiProperty({ description: '{ [action: string]: boolean }' })
    acknowledgedFor?: { [action: string]: boolean };
}

export enum NominationType {
    Digital = 'Digital', // I.e we have resolved who has responsible, from the contracts.
    Municipal = 'Municipal', // I.e municipality believes the nomination target is responsible
}

export enum RedirectionType {
    Manual = 'Manual Email',
    ATG = 'ATG Integration',
    Upload = 'Manual Upload',
    External = 'External',
    Telaviv = 'Telaviv',
    Jerusalem = 'Jerusalem',
    Police = 'Police',
    Mileon = 'Mileon',
    Metropark = 'Metropark',
    KfarSaba='KfarSaba',
    City4u='City4u',
}

@Entity()
export class Nomination extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    nominationId: number;

    @Column('enum', { enum: NominationType, default: NominationType.Digital })
    @ApiProperty({ enum: NominationType })
    type: NominationType; // Whether it's a digital or municipal nomination

    @Column('enum', { enum: RedirectionType, nullable: true })
    @Index()
    @ApiProperty({ enum: RedirectionType })
    redirectionType: RedirectionType; // Whether the redirection type is manual (email/fax) or integration

    @OneToOne((type) => Infringement, (infringement) => infringement.nomination, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    // Account links

    @ManyToOne((type) => Account, (account) => account.nominations, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'accountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    account: Account;

    @ManyToOne((type) => Account, (account) => account.previouslyNominated, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'redirectedFromAccountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    redirectedFrom: Account;

    @ManyToOne((type) => Account, (account) => account.toBeNominated, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'redirectionTargetAccountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    redirectionTarget: Account;

    // Documents

    @ManyToOne((type) => Document, (document) => document.nominationMerged, { nullable: true })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Document' })
    mergedDocument: Document;

    @ManyToOne((type) => Document, (document) => document.nominationRedirection, { nullable: true })
    @JoinColumn({ name: 'redirectionDocumentId', referencedColumnName: 'documentId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Document' })
    redirectionDocument: Document;

    @Column('enum', { enum: NominationStatus, default: NominationStatus.Pending })
    @ApiProperty({ enum: NominationStatus })
    status: NominationStatus;

    @Column('text', { nullable: true })
    @ApiProperty()
    redirectionError: string | null;

    @Column('jsonb', { default: new NominationDetails() })
    @ApiProperty({ description: 'NominationDetails' })
    details: NominationDetails;

    // Dates

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    nominationDate: string;

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    redirectedDate: string;

    @Column('timestamptz', { nullable: true })
    @Index()
    redirectionLetterSendDate: string;

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    paidDate: string;

    @Column({ nullable: true })
    @Index('nomination_raw_redirection_identifier_idx')
    @ApiProperty()
    rawRedirectionIdentifier: string;

    @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty()
    lastStatusChangeDate: string;

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty({ description: 'This date is automatically updated on mergedDocument trigger' })
    // This date is automatically updated on mergedDocument trigger
    mergedDocumentUpdatedDate: string;

    @Column({ nullable: true })
    @ApiProperty()
    externalRedirectionReference?: string;

    @BeforeInsert()
    @BeforeUpdate()
    fixupRedirectionError() {
        let errorStatuses = [NominationStatus.RedirectionRequestError, NominationStatus.RedirectionError];
        if (!includes(errorStatuses, this.status)) {
            this.redirectionError = null
        }
    }

    static async findForInfringement(infringementId: number): Promise<Nomination> {
        return await this.findWithMinimalRelations()
            .where('infringement.infringementId = :infringementId', { infringementId })
            .orderBy('nomination.createdAt', 'DESC')
            .take(1)
            .getOne();
    }

    static findWithMinimalRelations(): SelectQueryBuilder<Nomination> {
        return this.createQueryBuilder('nomination')
            .leftJoinAndSelect('nomination.infringement', 'infringement')
            .leftJoin('nomination.redirectedFrom', 'fromAccount')
            .addSelect(['fromAccount.accountId', 'fromAccount.name'])
            .leftJoin('nomination.redirectionTarget', 'targetAccount')
            .addSelect(['targetAccount.accountId', 'targetAccount.name'])
            .leftJoin('nomination.account', 'account')
            .addSelect(['account.accountId', 'account.name', 'account.identifier'])
            .leftJoinAndSelect('infringement.vehicle', 'vehicle')
            .leftJoinAndSelect('nomination.mergedDocument', 'mergedDocument')
            .leftJoinAndSelect('nomination.redirectionDocument', 'redirectionDocument')
            .leftJoinAndSelect('infringement.issuer', 'issuer')
            .leftJoinAndSelect('infringement.location', 'location')
            .leftJoinAndSelect('infringement.contract', 'contract')
            .leftJoinAndSelect('infringement.payments', 'payments')
            .leftJoin('contract.owner', 'contract_owner')
            .addSelect(['contract_owner.accountId', 'contract_owner.name', 'contract_owner.identifier'])
            .leftJoin('contract.user', 'contract_user')
            .addSelect(['contract_user.accountId', 'contract_user.name', 'contract_user.identifier'])
            .leftJoinAndSelect('contract_owner.physicalLocation', 'owner_location')
            .leftJoinAndSelect('contract_owner.postalLocation', 'owner_postal_location')
            .leftJoinAndSelect('contract_user.physicalLocation', 'user_location')
            .leftJoinAndSelect('contract_user.postalLocation', 'user_postal_location');
    }
}

/**
 * Created automatically from the trigger, please see migrations for the trigger
 */
@Entity()
export class NominationRevisionHistory {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    nominationHistoryId: number;

    @Column('int')
    @Index()
    @ApiProperty()
    nominationId: number;

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
}
