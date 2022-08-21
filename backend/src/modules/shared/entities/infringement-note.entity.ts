import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account, Infringement, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class InfringementNote extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    infringementNoteId: number;

    @Column('text')
    @ApiProperty()
    value: string;

    @ManyToOne((type) => Account, (account) => account.infringementNotes, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'createdBy', referencedColumnName: 'accountId' })
    @ApiProperty({ type: 'object', description: 'Account' })
    createdBy: Account;

    @ManyToOne((type) => Infringement, (infringement) => infringement.notes, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    @Column('boolean', {nullable: false, default: false})
    @ApiProperty()
    adminNote: boolean;

    static findWithMinimalRelations() {
        return this.createQueryBuilder('infringementNote')
            .leftJoinAndSelect('infringementNote.infringement', 'infringement')
            .leftJoin('infringementNote.createdBy', 'account')
            .addSelect(['account.accountId', 'account.name']);
    }
}
