import { Client, TimeStamped } from '@entities';
import { OldIsraelFleetRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement.mapper';
import { RawInfringementIdentifierService } from '@modules/raw-infringement/services/raw-infringement-identifier.service';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum RawInfringementStatus {
    Pending = 'Pending',
    Failed = 'Failed',
    Completed = 'Completed',
}

@Entity()
@Index(['noticeNumber', 'issuer'])
export class RawInfringement extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    rawInfringementId: number;

    @ManyToOne((type) => Client, (client) => client.rawInfringements, { nullable: false })
    @JoinColumn({ name: 'clientId', referencedColumnName: 'clientId' })
    @ApiProperty({ description: 'Client', type: 'object' })
    client: Client;

    @Column('int', { name: 'clientId' })
    @ApiProperty()
    clientId: number;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    data: any;

    @Column('enum', { enum: RawInfringementStatus, default: RawInfringementStatus.Pending })
    @ApiProperty({ enum: RawInfringementStatus, default: RawInfringementStatus.Pending })
    status: RawInfringementStatus;

    // Type any because the result will vary depending on if it needs to update or create an infringement as well as if the mapping was successful or not
    @Column('jsonb', { nullable: true })
    @ApiProperty()
    result: any;

    @Column('text', { nullable: true })
    @ApiProperty()
    noticeNumber: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    issuer: string;

    @BeforeInsert()
    addNoticeNumberAndIssuer() {
        this.noticeNumber = !this.noticeNumber ? RawInfringementIdentifierService.getNoticeNumber(this) : this.noticeNumber;
        this.issuer = !this.issuer ? RawInfringementIdentifierService.getIssuer(this) : this.issuer;
    }

    setStatus(status: RawInfringementStatus): RawInfringement {
        this.status = status;
        return this;
    }

    setResult(result: any): RawInfringement {
        this.result = result;
        return this;
    }

    static findWithMinimalRelations(): SelectQueryBuilder<RawInfringement> {
        return this.createQueryBuilder('rawInfringement').leftJoinAndSelect('rawInfringement.client', 'client');
    }
}
