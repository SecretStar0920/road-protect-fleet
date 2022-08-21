import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class TimeStamped extends BaseEntity {
    @CreateDateColumn({ type: 'timestamptz', nullable: true })
    @ApiProperty()
    createdAt: string;
    @UpdateDateColumn({ type: 'timestamptz', nullable: true })
    @ApiProperty()
    updatedAt: string;
}
