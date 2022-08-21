import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Infringement, TimeStamped, Vehicle } from '@entities';
import { Logger } from '@logger';
import { ApiProperty } from '@nestjs/swagger';

class CreateAndSaveIturanLocationRecordParameters {
    @ApiProperty()
    address: string;
    @ApiProperty()
    lon: string;
    @ApiProperty()
    lat: string;
    @ApiProperty()
    date: string;
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement?: Infringement;
}

@Entity()
export class IturanLocationRecord extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    recordId: number;

    @Column('text')
    @ApiProperty()
    address: string;

    @Column('text')
    @ApiProperty()
    lon: string;

    @Column('text')
    @ApiProperty()
    lat: string;

    @Column('timestamptz')
    @Index()
    @ApiProperty()
    date: string;

    @ManyToOne((type) => Vehicle, (vehicle) => vehicle.locationRecords, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'vehicleId', referencedColumnName: 'vehicleId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Vehicle' })
    vehicle: Vehicle;

    static async createAndSave(props: CreateAndSaveIturanLocationRecordParameters) {
        this.create(props)
            .save()
            .catch((error) =>
                Logger.instance.error({
                    message: 'Failed to create a location record',
                    detail: props,
                    fn: 'IturanLocationRecord.createAndSave',
                }),
            );
    }
}
