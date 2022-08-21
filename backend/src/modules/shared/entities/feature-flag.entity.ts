import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class FeatureFlag extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index()
    @ApiProperty()
    featureFlagId: number;

    @Column('text')
    @Index({ unique: true })
    @ApiProperty()
    title: string; // Flag title

    @Column('text', { nullable: true })
    @ApiProperty()
    description: string; // Small description to help developers

    @Column('text', { nullable: true })
    @ApiProperty()
    disabledMessage: string; // What message to return if enabled is false and execution is attempted

    @Column('text', { nullable: true, default: 'operations' })
    @ApiProperty()
    category: string; // What realm the flag is useful for: Operations, Frontend, Backend etc

    @Column('bool')
    @ApiProperty()
    enabled: boolean; // Whether the feature is enabled or not
}
