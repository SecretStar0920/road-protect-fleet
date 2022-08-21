import {
    Brackets,
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    SelectQueryBuilder,
    Unique,
} from 'typeorm';
import { DriverContract, PhysicalLocation, PostalLocation, TimeStamped } from '@entities';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { ApiProperty } from '@nestjs/swagger';

export const DRIVER_CONSTRAINTS: IDatabaseConstraints = {
    idNumber: {
        keys: ['idNumber'],
        constraint: 'unique_id_number',
        description: 'An driver with this ID number already exists',
    },
};

@Entity()
@Unique(DRIVER_CONSTRAINTS.idNumber.constraint, DRIVER_CONSTRAINTS.idNumber.keys)
export class Driver extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    driverId: number;

    @Column('text')
    @ApiProperty()
    name: string;

    @Column('text')
    @ApiProperty()
    surname: string;

    @Column('text')
    @ApiProperty()
    idNumber: string;

    @Column('text')
    @ApiProperty()
    licenseNumber: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    email: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    cellphoneNumber: string;

    @OneToOne((type) => PhysicalLocation, (location) => location.accountPhysical, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'physicalLocationId', referencedColumnName: 'locationId' })
    @ApiProperty({ type: 'object', description: 'PhysicalLocation', title: 'PhysicalLocation' })
    physicalLocation: PhysicalLocation;

    @OneToOne((type) => PostalLocation, (location) => location.accountPostal, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'postalLocationId', referencedColumnName: 'locationId' })
    @ApiProperty({ type: 'object', description: 'PostalLocation' })
    postalLocation: PostalLocation;

    // Contracts
    @OneToMany((type) => DriverContract, (contract) => contract.driver)
    @ApiProperty({ type: 'object', description: 'DriverContract[]' })
    asDriver: DriverContract[]; // driven vehicles

    static findWithMinimalRelations(): SelectQueryBuilder<Driver> {
        return this.createQueryBuilder('driver')
            .leftJoinAndSelect('driver.physicalLocation', 'location')
            .leftJoinAndSelect('driver.postalLocation', 'postalLocation');
    }

    static findByLicenseOrId(driverIdentifier: string): Promise<Driver> {
        return this.createQueryBuilder('driver')
            .leftJoinAndSelect('driver.physicalLocation', 'location')
            .leftJoinAndSelect('driver.postalLocation', 'postalLocation')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('driver.licenseNumber = :licenseNumber', { licenseNumber: driverIdentifier });
                    qb.orWhere('driver.idNumber = :idNumber', { idNumber: driverIdentifier });
                }),
            )
            .getOne();
    }
}
