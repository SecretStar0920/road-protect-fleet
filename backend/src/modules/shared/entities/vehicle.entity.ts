import { Contract, Infringement, IturanLocationRecord, LeaseContract, Log, OwnershipContract, TimeStamped } from '@entities';
import { isNullOrUndefined } from '@modules/shared/helpers/is-null-or-undefined';
import { isNumberString } from '@modules/shared/helpers/is-number-string';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export const VEHICLE_CONSTRAINTS: IDatabaseConstraints = {
    registration: {
        keys: ['registration'],
        constraint: 'unique_registration',
        description: 'A vehicle with this registration already exists',
    },
};

export enum NominationTarget {
    Owner = 'Owner',
    User = 'User',
    // Driver = 'Driver',
}

export enum VehicleType {
    Private = 'Private',
    Truck = 'Truck',
}

@Entity()
@Unique(VEHICLE_CONSTRAINTS.registration.constraint, VEHICLE_CONSTRAINTS.registration.keys)
export class Vehicle extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    vehicleId: number;

    @Column('text')
    @Index()
    @ApiProperty()
    registration: string;

    @Column('text')
    @ApiProperty()
    manufacturer: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    model: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    modelYear: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    color: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    category: string;

    @Column('int', { nullable: true })
    @ApiProperty()
    weight: number;

    @Column({
        type: 'enum',
        enum: VehicleType,
        default: VehicleType.Private,
    })
    @ApiProperty({
        default: VehicleType.Private,
        enum: VehicleType,
    })
    type: VehicleType;

    // Contracts

    @OneToMany((type) => Contract, (contract) => contract.vehicle)
    @ApiProperty({ description: 'Contract[]' })
    contracts: Contract[];

    @OneToOne((type) => LeaseContract, (contract) => contract.currentLeaseForVehicle, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'currentLeaseContract', referencedColumnName: 'contractId' })
    @Index()
    @ApiProperty({ description: 'LeaseContract', type: 'object' })
    currentLeaseContract: LeaseContract;

    @OneToOne((type) => OwnershipContract, (contract) => contract.currentOwnershipForVehicle, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'currentOwnershipContract', referencedColumnName: 'contractId' })
    @Index()
    @ApiProperty({ description: 'OwnershipContract', type: 'object' })
    currentOwnershipContract: OwnershipContract;

    // @OneToMany(type => VehicleDocument, vehicleDocument => vehicleDocument.vehicle)
    // documents: VehicleDocument[];

    @OneToMany((type) => Infringement, (infringement) => infringement.vehicle)
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringements: Infringement[];

    @Column('enum', { enum: NominationTarget, default: NominationTarget.Owner })
    @ApiProperty({ enum: NominationTarget })
    autoAssignTo: NominationTarget;

    @OneToMany((type) => Log, (log) => log.vehicle)
    @ApiProperty({ description: 'Log[]', type: 'object' })
    logs: Log[];

    @OneToMany((type) => IturanLocationRecord, (locationRecord) => locationRecord.vehicle)
    @ApiProperty({ description: 'IturanLocationRecord[]', type: 'object' })
    locationRecords: IturanLocationRecord[];

    // Queries

    static async findOneByRegistrationOrId(idOrName: string | number): Promise<Vehicle> {
        const query = this.findWithMinimalRelations().andWhere('vehicle.registration = :idOrName', { idOrName });
        if (!isNullOrUndefined(idOrName) && !isNaN(Number(idOrName)) && isNumberString(idOrName.toString())) {
            query.orWhere('vehicle.vehicleId = :idOrName', { idOrName: Number(idOrName) });
        }
        return query.getOne();
    }

    static async findWhereRegistrationIn(registration: string[]) {
        return this.createQueryBuilder('vehicle')
            .select(['vehicle.registration'])
            .andWhere('vehicle.registration IN (:...registration)', { registration });
    }

    static findWithMinimalRelations() {
        return (
            this.createQueryBuilder('vehicle')
                // All contracts
                .leftJoin('vehicle.contracts', 'contracts')
                .addSelect(['contracts.contractId', 'contracts.type', 'contracts.startDate', 'contracts.endDate'])
                .leftJoin('contracts.user', 'contracts_user')
                .addSelect(['contracts_user.name', 'contracts_user.accountId'])
                .leftJoin('contracts.owner', 'contracts_owner')
                .addSelect(['contracts_owner.name', 'contracts_owner.accountId'])
                // Current LEASE contract
                .leftJoinAndSelect('vehicle.currentLeaseContract', 'currentLeaseContract')
                .leftJoin('currentLeaseContract.user', 'leaseUser')
                .addSelect(['leaseUser.name', 'leaseUser.identifier', 'leaseUser.accountId'])
                .leftJoin('currentLeaseContract.owner', 'leaseOwner')
                .addSelect(['leaseOwner.name', 'leaseOwner.identifier', 'leaseOwner.accountId'])
                // Current OWNERSHIP contract
                .leftJoinAndSelect('vehicle.currentOwnershipContract', 'currentOwnershipContract')
                .leftJoin('currentOwnershipContract.owner', 'owner')
                .addSelect(['owner.name', 'owner.identifier', 'owner.accountId'])
                // Infringements on vehicle
                .leftJoin('vehicle.infringements', 'infringement')
                .addSelect([
                    'infringement.infringementId',
                    'infringement.amountDue',
                    'infringement.noticeNumber',
                    'infringement.status',
                    'infringement.offenceDate',
                    'infringement.contract',
                    'infringement.brn',
                ])
        );
    }
}
