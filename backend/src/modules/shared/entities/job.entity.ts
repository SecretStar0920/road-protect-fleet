import { TimeStamped, User } from '@entities';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum JobStatus {
    Queued = 'Queued',
    InProgress = 'Processing',
    Completed = 'Completed',
    Failed = 'Failed',
    Cancelled = 'Cancelled',
}

@Entity()
export class Job extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    jobId: number;

    @Column('text', { unique: true })
    @ApiProperty()
    uuid: string;

    @Column('timestamptz', { nullable: true })
    @ApiProperty()
    startTime: string;

    @Column('timestamptz', { nullable: true })
    @ApiProperty()
    endTime: string;

    @Column('text')
    @ApiProperty()
    queue: string;

    @Column('text')
    @ApiProperty()
    type: string;

    @Column('enum', { enum: JobStatus })
    @ApiProperty({ enum: JobStatus })
    status: JobStatus;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    details: any;

    @Column('jsonb', { nullable: true })
    @ApiProperty()
    error: any;

    @ManyToOne((type) => User, (user) => user.jobs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ referencedColumnName: 'userId', name: 'userId' })
    @Index()
    @ApiProperty({ description: 'User', type: 'object' })
    user: User;

    static findWithMinimalRelations() {
        return this.createQueryBuilder('job').leftJoin('job.user', 'user').addSelect(['user.name', 'user.surname']);
    }
}
