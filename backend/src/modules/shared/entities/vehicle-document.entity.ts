import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Document, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class VehicleDocument extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    vehicleDocumentId: number;

    // @ManyToOne(type => Vehicle, vehicle => vehicle.documents)
    // @JoinColumn({ name: 'vehicleid', referencedColumnName: 'vehicleId' })
    // vehicle: Vehicle;
    //
    @ManyToOne((type) => Document, (vehicleDocument) => vehicleDocument.vehicleDocuments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @Index()
    @ApiProperty({ description: 'Document', type: 'object' })
    document: Document;

    // @Column('int', { name: 'documentId' })
    // documentId: number;
}
