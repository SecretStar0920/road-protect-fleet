import { Column, Entity, Index, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { TimeStamped } from '@entities';
import { PartialInfringementDetailsDto } from '@modules/partial-infringement/dtos/partial-infringement-details.dto';
import { ApiProperty } from '@nestjs/swagger';

export enum PartialInfringementStatus {
    Pending = 'Pending',
    Queued = 'Queued',
    Processed = 'Processed',
    Successful = 'Successful',
    Failed = 'Failed',
}

@Entity()
export class PartialInfringement extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    partialInfringementId: number;

    @Column('jsonb', { default: {} })
    @ApiProperty({ type: () => PartialInfringementDetailsDto })
    details: PartialInfringementDetailsDto;

    @Column('text', { nullable: true })
    @ApiProperty()
    noticeNumber: string;

    @Column('enum', { enum: PartialInfringementStatus, default: PartialInfringementStatus.Pending })
    @ApiProperty({ enum: PartialInfringementStatus, default: PartialInfringementStatus.Pending })
    status: PartialInfringementStatus;

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    processedDate: string;

    @Column('jsonb', { nullable: true })
    @ApiProperty()
    response: any;

    static findWithMinimalRelations(): SelectQueryBuilder<PartialInfringement> {
        return this.createQueryBuilder('partialInfringement');
    }
}
