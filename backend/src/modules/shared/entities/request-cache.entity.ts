import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
// General purpose request cache for possibility of replaying requests from partners
export class RequestCache extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index()
    @ApiProperty()
    requestCacheId: number;

    @Column('jsonb', { nullable: true })
    @ApiProperty()
    requestDetails?: any;

    @Column('jsonb', { nullable: true })
    @ApiProperty()
    responseDetails?: any;
}
