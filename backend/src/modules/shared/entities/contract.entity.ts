import { Account, ContractType, Document, Driver, Infringement, TimeStamped, Vehicle } from '@entities';
import {
    AfterLoad,
    Brackets,
    Check,
    ChildEntity,
    Column,
    Entity,
    Exclusion,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    SelectQueryBuilder,
    TableInheritance,
} from 'typeorm';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { Logger } from '@logger';
import { ExtractRedirectionAddressDetailsService } from '@modules/nomination/services/extract-redirection-address-details.service';
import { get } from 'lodash';
import { ApiProperty } from '@nestjs/swagger';

export const CONTRACT_CONSTRAINTS: IDatabaseConstraints = {
    dateOverlap: {
        constraint: 'unique_date_range',
        description: 'A contract of this type already exists on this vehicle for the provided date range.',
        expression: `USING GIST (
                "vehicleId" WITH =,
                "type" WITH =,
                TSTZRANGE("startDate", "endDate", '[]') WITH &&
            )`,
    },
    endDateAfterStartDate: {
        constraint: 'valid_date_range',
        description: 'The end date must be after the start date',
        expression: `"endDate" >= "startDate"`,
    },
};

export enum ContractStatus {
    Upcoming = 'Upcoming',
    Expired = 'Expired',
    ExpiringSoon = 'Expiring soon',
    Valid = 'Valid',
}

export enum ContractOcrStatus {
    Success = 'Success',
    Failed = 'Failed',
    Incomplete = 'Incomplete',
    Modified = 'Modified',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
// @see https://stackoverflow.com/questions/10616099/postgres-date-overlapping-constraint
// @see https://typeorm.io/#/decorator-reference/exclusion
@Exclusion(CONTRACT_CONSTRAINTS.dateOverlap.constraint, CONTRACT_CONSTRAINTS.dateOverlap.expression)
@Check(CONTRACT_CONSTRAINTS.endDateAfterStartDate.constraint, CONTRACT_CONSTRAINTS.endDateAfterStartDate.expression)
export abstract class Contract extends TimeStamped {
    // Shared
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    contractId: number;

    @ApiProperty()
    abstract type: ContractType;

    // Null means negative infinity
    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    startDate: string;

    // Null means positive infinity
    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    endDate: string;

    @Column('enum', { enum: ContractStatus, default: ContractStatus.Valid })
    @Index()
    @ApiProperty({ enum: ContractStatus })
    status: ContractStatus;

    @Column('text', { nullable: true })
    @ApiProperty()
    reference: string; // Used to batch upload documents at a later stage

    @OneToOne((type) => Document, (document) => document.contract, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Document' })
    document: Document;

    // All vehicle contracts relate to an owner, only leases have a user

    @ManyToOne((type) => Account, (account) => account.asOwner, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'ownerId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    owner: Account;

    // Vehicle

    @ManyToOne((type) => Vehicle, (vehicle) => vehicle.contracts, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'vehicleId', referencedColumnName: 'vehicleId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Vehicle' })
    vehicle: Vehicle;

    // Infringement

    @OneToMany((type) => Infringement, (infringement) => infringement.contract)
    @ApiProperty({ type: 'object', description: 'Infringement[]' })
    infringements: Infringement[];

    //////////////////////////////////////////////////////////////////
    // CALCULATED FIELD
    //////////////////////////////////////////////////////////////////

    @ApiProperty({ description: 'This is a calculated field' })
    redirectionTargetAddress: string;

    @AfterLoad()
    async getRedirectionTargetAddress() {
        if (this.type === ContractType.Ownership) {
            return;
        }

        try {
            if (!get(this, 'user', true)) {
                return;
            }
            const extract = new ExtractRedirectionAddressDetailsService(Logger.instance);
            const details = await extract.extractRedirectionAddressDetails(get(this, 'user', null));

            this.redirectionTargetAddress = details.location?.address;
        } catch (e) {
            return;
        }
    }

    /**
     * Returns contracts that were valid or expiring soon and which should now be expired
     */
    static async findExpired(): Promise<Contract[]> {
        return this.createQueryBuilder('contract')
            .andWhere('contract.endDate <= (CURRENT_TIMESTAMP)')
            .andWhere('contract.status != :status', { status: ContractStatus.Expired })
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .leftJoin('contract.owner', 'owner')
            .addSelect('owner.primaryContact')
            .leftJoin('contract.user', 'user')
            .addSelect('user.primaryContact')
            .leftJoin('contract.driver', 'driver')
            .addSelect(['driver.idNumber', 'driver.licenseNumber', 'driver.driverId'])
            .getMany();
    }

    /**
     * Returns contracts that were valid which are expiring in the next 2 weeks
     */
    static async findExpiringSoon(): Promise<Contract[]> {
        return this.createQueryBuilder('contract')
            .andWhere(`contract.endDate <= (CURRENT_TIMESTAMP + interval '2 weeks')`)
            .andWhere('contract.status != :expiringSoon', { expiringSoon: ContractStatus.ExpiringSoon })
            .andWhere('contract.status != :expired', { expired: ContractStatus.Expired })
            .leftJoinAndSelect('contract.vehicle', 'vehicle')
            .leftJoin('contract.owner', 'owner')
            .addSelect('owner.primaryContact')
            .leftJoin('contract.user', 'user')
            .addSelect('user.primaryContact')
            .leftJoin('contract.driver', 'driver')
            .addSelect(['driver.idNumber', 'driver.licenseNumber', 'driver.driverId'])
            .getMany();
    }

    static findWithMinimalRelations() {
        return this.createQueryBuilder('contract')
            .leftJoin('contract.vehicle', 'vehicle')
            .leftJoin('contract.currentLeaseForVehicle', 'currentLeaseForVehicle')
            .leftJoin('contract.currentOwnershipForVehicle', 'currentOwnershipForVehicle')
            .addSelect(['currentLeaseForVehicle.vehicleId', 'currentLeaseForVehicle.registration'])
            .addSelect(['currentOwnershipForVehicle.vehicleId', 'currentOwnershipForVehicle.registration'])
            .addSelect(['vehicle.vehicleId', 'vehicle.registration'])
            .leftJoinAndSelect('contract.document', 'document')
            .leftJoinAndSelect('contract.redirectionDocument', 'redirectionDocument')
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.accountId', 'owner.name', 'owner.identifier'])
            .leftJoin('contract.user', 'user')
            .addSelect(['user.accountId', 'user.name', 'user.identifier'])
            .leftJoin('contract.driver', 'driver')
            .addSelect(['driver.idNumber', 'driver.licenseNumber', 'driver.driverId']);
    }

    static findByReference(reference: string) {
        return this.findWithMinimalRelations().andWhere('contract.reference = :reference', { reference });
    }

    static findByReferenceAndAccountId(reference: string, accountId: number) {
        return this.findWithMinimalRelations()
            .where('contract.reference = :reference', { reference })
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('owner.accountId = :accountId', { accountId });
                    qb.orWhere('user.accountId = :accountId', { accountId });
                }),
            );
    }

    static findByIdAndAccountId(contractId: number, accountId: number) {
        return this.findWithMinimalRelations()
            .where('contract.contractId = :contractId', { contractId })
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('owner.accountId = :accountId', { accountId });
                    qb.orWhere('user.accountId = :accountId', { accountId });
                }),
            );
    }
}

@ChildEntity()
export class LeaseContract extends Contract {
    @ApiProperty({ default: ContractType.Lease })
    type: ContractType = ContractType.Lease;

    @ManyToOne((type) => Account, (account) => account.asUser, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    user: Account;

    // @Column('int', { name: 'userId', nullable: true })
    // userId: number;

    @Column('enum', { enum: ContractOcrStatus, default: ContractOcrStatus.Incomplete })
    @Index()
    @ApiProperty({ enum: ContractOcrStatus, default: ContractOcrStatus.Incomplete })
    ocrStatus: ContractOcrStatus;

    @OneToOne((type) => Vehicle, (vehicle) => vehicle.currentLeaseContract, { onDelete: 'CASCADE' })
    @ApiProperty({ type: 'object', description: 'Vehicle' })
    currentLeaseForVehicle: Vehicle;

    @OneToOne((type) => Document, (document) => document.leaseContract, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'redirectionDocumentId', referencedColumnName: 'documentId' })
    @ApiProperty({ type: 'object', description: 'Document' })
    redirectionDocument: Document; // TODO: rename to leaseContractSubstituteDocument

    static findWithMinimalRelations(): SelectQueryBuilder<LeaseContract> {
        return this.createQueryBuilder('contract')
            .leftJoin('contract.vehicle', 'vehicle')
            .addSelect(['vehicle.vehicleId', 'vehicle.registration'])
            .leftJoinAndSelect('contract.document', 'document')
            .leftJoinAndSelect('contract.redirectionDocument', 'redirectionDocument')
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.accountId', 'owner.name', 'owner.identifier'])
            .leftJoin('contract.user', 'user')
            .addSelect(['user.accountId', 'user.name', 'user.identifier']);
    }

    static findByVehicleAndDate(vehicleId: number, date: string): SelectQueryBuilder<LeaseContract> {
        return this.createQueryBuilder('contract')
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.accountId', 'owner.name'])
            .leftJoin('contract.user', 'user')
            .addSelect(['user.accountId', 'user.name'])
            .innerJoin('contract.vehicle', 'vehicle', 'vehicle.vehicleId = :id', { id: vehicleId })
            .andWhere(`tstzrange(contract.startDate, contract.endDate, '[]') @> :date::timestamptz`, { date });
    }

    static checkOverlapping(vehicleId: number, startDate: string, endDate: string): SelectQueryBuilder<LeaseContract> {
        return this.createQueryBuilder('contract')
            .select(['contract.contractId', 'contract.reference', 'contract.startDate', 'contract.endDate'])
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.name', 'owner.identifier'])
            .leftJoin('contract.user', 'user')
            .addSelect(['user.name', 'user.identifier'])
            .innerJoin('contract.vehicle', 'vehicle', 'vehicle.vehicleId = :id', { id: vehicleId })
            .andWhere(`tstzrange(:startDate, :endDate, '[]') && tstzrange(contract.startDate, contract.endDate, '[]')`, {
                startDate,
                endDate,
            });
    }

    static findById(id: number) {
        return this.findWithMinimalRelations().where('contract.contractId = :id', { id }).getOne();
    }
}

@ChildEntity()
export class OwnershipContract extends Contract {
    @ApiProperty({ default: ContractType.Ownership })
    type: ContractType = ContractType.Ownership;

    @OneToOne((type) => Vehicle, (vehicle) => vehicle.currentOwnershipContract, { onDelete: 'CASCADE' })
    @ApiProperty({ type: 'object', description: 'Vehicle' })
    currentOwnershipForVehicle: Vehicle;

    static findWithMinimalRelations(): SelectQueryBuilder<OwnershipContract> {
        return this.createQueryBuilder('contract')
            .leftJoin('contract.vehicle', 'vehicle')
            .addSelect(['vehicle.vehicleId', 'vehicle.registration'])
            .leftJoinAndSelect('contract.document', 'document')
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.accountId', 'owner.name']);
    }

    static findByVehicleAndDate(vehicleId: number, date: string): SelectQueryBuilder<OwnershipContract> {
        return this.createQueryBuilder('contract')
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.accountId', 'owner.name'])
            .leftJoin('contract.user', 'user')
            .addSelect(['user.accountId', 'user.name'])
            .innerJoin('contract.vehicle', 'vehicle', 'vehicle.vehicleId = :id', { id: vehicleId })
            .andWhere(`tstzrange(contract.startDate , contract.endDate, '[]') @> :date::timestamptz`, { date });
    }

    static checkOverlapping(vehicleId: number, startDate: string, endDate: string): SelectQueryBuilder<OwnershipContract> {
        return this.createQueryBuilder('contract')
            .select(['contract.startDate', 'contract.endDate', 'contract.contractId'])
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.name', 'owner.identifier'])
            .innerJoin('contract.vehicle', 'vehicle', 'vehicle.vehicleId = :id', { id: vehicleId })
            .andWhere(`tstzrange(:startDate, :endDate, '[]') && tstzrange(contract.startDate , contract.endDate, '[]')`, {
                startDate,
                endDate,
            });
    }

    static findById(id: number) {
        return this.findWithMinimalRelations().where('contract.contractId = :id', { id }).getOne();
    }
}

@ChildEntity()
export class DriverContract extends Contract {
    @ApiProperty({ default: ContractType.Driver })
    type: ContractType = ContractType.Driver;

    @OneToOne((type) => Vehicle, (vehicle) => vehicle.currentOwnershipContract, { onDelete: 'CASCADE' })
    @ApiProperty({ type: 'object', description: 'Vehicle' })
    currentDriverForVehicle: Vehicle;

    @ManyToOne((type) => Driver, (driver) => driver.asDriver, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'driverId', referencedColumnName: 'driverId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Driver' })
    driver: Driver;

    static findWithMinimalRelations(): SelectQueryBuilder<DriverContract> {
        return this.createQueryBuilder('contract')
            .leftJoin('contract.vehicle', 'vehicle')
            .addSelect(['vehicle.vehicleId', 'vehicle.registration'])
            .leftJoinAndSelect('contract.document', 'document')
            .leftJoin('contract.driver', 'driver')
            .addSelect(['driver.idNumber', 'driver.licenseNumber', 'driver.driverId']);
    }

    static checkOverlapping(vehicleId: number, startDate: string, endDate: string): SelectQueryBuilder<DriverContract> {
        return this.createQueryBuilder('contract')
            .select(['contract.startDate', 'contract.endDate', 'contract.contractId'])
            .leftJoin('contract.driver', 'driver')
            .addSelect(['driver.idNumber', 'driver.licenseNumber', 'driver.driverId'])
            .innerJoin('contract.vehicle', 'vehicle', 'vehicle.vehicleId = :id', { id: vehicleId })
            .andWhere(`tstzrange(:startDate, :endDate, '[]') && tstzrange(contract.startDate , contract.endDate, '[]')`, {
                startDate,
                endDate,
            });
    }

    static findById(id: number) {
        return this.findWithMinimalRelations().where('contract.contractId = :id', { id }).getOne();
    }
}
