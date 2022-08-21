import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
    Account,
    AccountRelation,
    AccountRelationDocument,
    Contract,
    GeneratedDocument,
    Infringement,
    LeaseContract,
    ManualPayment,
    Nomination,
    TimeStamped,
    VehicleDocument,
} from '@entities';
import { OcrDetails } from '@modules/shared/models/ocr-details.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Document extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    documentId: number;

    @Column('text')
    @ApiProperty()
    storageName: string;

    @Column('text')
    @ApiProperty()
    fileName: string;

    @Column('text')
    @ApiProperty()
    fileDirectory: string; // relative to Config.get.storage()

    @Column('jsonb', { nullable: true, default: null })
    @ApiProperty({ type: () => OcrDetails, description: 'Results from contract OCR' })
    ocr: OcrDetails;

    @OneToOne((type) => Contract, (contract) => contract.document) // Lease Contract
    @ApiProperty({ type: 'object', description: 'Contract' })
    contract: Contract;

    @OneToOne((type) => LeaseContract, (lease) => lease.redirectionDocument) // Substitute Lease Contract
    @ApiProperty({ type: 'object', description: 'LeaseContract' })
    leaseContract: LeaseContract;

    @OneToMany((type) => VehicleDocument, (vehicleDocument) => vehicleDocument.document) // Vehicle Documents [Registration] (not used for much right now)
    @ApiProperty({ type: 'object', description: 'Vehicle Documents [Registration] (not used for much right now)' })
    vehicleDocuments: VehicleDocument[];

    @OneToOne((type) => Infringement, (infringement) => infringement.document) // Scan of Infringement
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    @OneToOne((type) => ManualPayment, (payment) => payment.document) // Scan of Receipt
    @ApiProperty({ type: 'object', description: 'ManualPayment' })
    manualPayment: ManualPayment;

    @OneToMany((type) => Nomination, (nomination) => nomination.mergedDocument) // Power of Attorney + (Lease Contract || Lease Contract Substitute) + Redirection Document
    @ApiProperty({ type: 'object', description: 'Nomination[]' })
    nominationMerged: Nomination[];

    @OneToMany((type) => Nomination, (nomination) => nomination.redirectionDocument) // Automatically Generated Document for Redirection
    @ApiProperty({ type: 'object', description: 'Nomination[]' })
    nominationRedirection: Nomination[];

    @OneToOne((type) => Account, (account) => account.powerOfAttorney) // Power of Attorney for an account
    @ApiProperty({ type: 'object', description: 'Account' })
    account: Account;

    @OneToOne((type) => GeneratedDocument, (generatedDocument) => generatedDocument.document)
    @ApiProperty({ type: 'object', description: 'GeneratedDocument' })
    generatedDocument: GeneratedDocument;

    @OneToMany((type) => AccountRelationDocument, (document) => document.document)
    @ApiProperty({ type: 'object', description: 'AccountRelation' })
    relations: AccountRelation[];

    static findPowerOfAttorneyByAccount(accountId: number) {
        return this.createQueryBuilder('document')
            .innerJoinAndSelect('document.account', 'account')
            .where('account.accountId = :accountId', { accountId });
    }

    static findByContract(contractId: number) {
        return this.createQueryBuilder('document')
            .innerJoinAndSelect('document.contract', 'contract')
            .where('contract.contractId = :contractId', { contractId });
    }

    static findLeaseContractSubstituteDocument(contractId: number) {
        return this.createQueryBuilder('document')
            .innerJoinAndSelect('document.leaseContract', 'leaseContract')
            .where('leaseContract.contractId = :contractId', { contractId });
    }

    static findRedirectionByNomination(nominationId: number) {
        return this.createQueryBuilder('document')
            .innerJoinAndSelect('document.nominationRedirection', 'nomination')
            .where('nomination.nominationId = :nominationId', { nominationId });
    }

    static findByDocumentId(documentId: number) {
        return this.createQueryBuilder('document').where('document.documentId = :documentId', { documentId });
    }
}
