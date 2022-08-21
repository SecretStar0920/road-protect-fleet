import { AfterLoad, ChildEntity, Column, Entity, Index, OneToOne, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { Account, Infringement, TimeStamped } from '@entities';
import { GeocodingResponse } from '@google/maps';
import { isEmpty } from 'lodash';
import { LocationType } from '@modules/shared/entities/locationType';
import { ApiProperty } from '@nestjs/swagger';
import { Driver } from '@modules/shared/entities/driver.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Location extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    locationId: number;

    //////////////////////////////////////////////////////////////////
    // SHARED FIELDS BETWEEN POSTAL AND PHYSICAL ADDRESSES
    //////////////////////////////////////////////////////////////////

    @Column('text', { nullable: true })
    @ApiProperty()
    city: string;

    @Column('text')
    @ApiProperty()
    country: string;

    @Column('text', { nullable: true })
    @ApiProperty({ description: 'Zip Code' })
    code: string; // zipCode

    @Column('text', { nullable: true })
    @ApiProperty()
    proximity: string; // For infringement locations mostly

    @Column('text', { nullable: true })
    @ApiProperty()
    rawAddress: string; // The string used to create it

    //////////////////////////////////////////////////////////////////
    // GOOGLE PARSING
    //////////////////////////////////////////////////////////////////

    @Column('text', { nullable: true })
    @ApiProperty()
    formattedAddress: string;

    //////////////////////////////////////////////////////////////////
    // RELATIONS
    //////////////////////////////////////////////////////////////////

    @OneToOne((type) => Infringement, (infringement) => infringement.location)
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    //////////////////////////////////////////////////////////////////
    // CALCULATED FIELD
    //////////////////////////////////////////////////////////////////

    @ApiProperty({ description: 'Calculated field' })
    address: string;
}

@ChildEntity()
export class PhysicalLocation extends Location {
    @ApiProperty({ default: LocationType.Physical })
    type: LocationType = LocationType.Physical;

    @Column('text')
    @ApiProperty()
    streetName: string;

    @Column('text')
    @ApiProperty()
    streetNumber: string;

    @Column('jsonb', { default: [] })
    @ApiProperty()
    googleLocation: GeocodingResponse;

    @Column('bool', { default: false })
    @Index()
    @ApiProperty()
    hasGoogleResult: boolean;

    @OneToOne((type) => Account, (account) => account.physicalLocation)
    @ApiProperty({ type: 'object', description: 'Account' })
    accountPhysical: Account;

    @OneToOne((type) => Driver, (driver) => driver.physicalLocation)
    @ApiProperty({ type: 'object', description: 'Driver' })
    driverPhysical: Driver;

    @AfterLoad()
    getAddress() {
        if (this.formattedAddress) {
            this.address = this.formattedAddress;
            return;
        }
        // let fields = [[this.streetName, this.streetNumber].join(' '), this.city, this.country, this.code];
        // Alex asked to remove country from display 29/06/2021
        let fields = [[this.streetName, this.streetNumber].join(' '), this.city, this.code];
        if (this.proximity) {
            // fields = [[this.streetName, this.streetNumber, this.proximity].join(' '), this.city, this.country, this.code];
            fields = [[this.streetName, this.streetNumber, this.proximity].join(' '), this.city, this.code];
        }

        this.address = fields.filter((field) => !isEmpty(field)).join(', ');
    }
}

@ChildEntity()
export class PostalLocation extends Location {
    @ApiProperty({ default: LocationType.Postal })
    type: LocationType = LocationType.Postal;

    @Column('text')
    @ApiProperty()
    postOfficeBox: string;

    @OneToOne((type) => Account, (account) => account.postalLocation)
    @ApiProperty({ type: 'object', description: 'Account' })
    accountPostal: Account;

    @OneToOne((type) => Driver, (driver) => driver.postalLocation)
    @ApiProperty({ type: 'object', description: 'Driver' })
    driverPostal: Driver;

    @AfterLoad()
    getAddress() {
        if (this.formattedAddress) {
            this.address = this.formattedAddress;
            return;
        }
        this.address = [` ת.ד ${this.postOfficeBox}`, this.city, this.country, this.code].filter((field) => !isEmpty(field)).join(', ');
    }
}
