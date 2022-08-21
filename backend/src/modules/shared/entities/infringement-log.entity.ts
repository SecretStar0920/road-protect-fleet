import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Infringement, TimeStamped } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ApiProperty } from '@nestjs/swagger';

class CreateAndSaveLogParameters {
    @ApiProperty()
    oldStatus: string;
    @ApiProperty()
    newStatus: string;
    @ApiProperty()
    data: any;
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;
}

@Entity()
export class InfringementLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    infringementLogId: number;

    @Column('text')
    @ApiProperty()
    oldStatus: string;

    @Column('text')
    @ApiProperty()
    newStatus: string;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    data: any;

    @ManyToOne((type) => Infringement, (infringement) => infringement.infringementLogs, {
        nullable: true,
        onDelete: 'SET NULL',
        eager: true,
    })
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    @Transactional()
    static async createAndSave(props: CreateAndSaveLogParameters) {
        return this.create(props).save();
    }
}
