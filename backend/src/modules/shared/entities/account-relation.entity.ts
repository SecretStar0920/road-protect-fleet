import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Account, AccountRelationDocument, TimeStamped } from '@entities';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { ApiProperty } from '@nestjs/swagger';

export class AccountRelationData {
    @ApiProperty()
    summary: string; // Short summary of the relation for the table
    @ApiProperty()
    customFields?: any; // Things like {internalReference: 12371}
}

export class AccountRelationReporting {
    @ApiProperty()
    receiveWeeklyReport: boolean;
    @ApiProperty()
    timezone?: string;
    @ApiProperty()
    ccAddress?: string[];
    @ApiProperty()
    customSignature?: string;
    @ApiProperty()
    customHeader?: string;
    @ApiProperty()
    customFooter?: string;
    @ApiProperty()
    emailBody?: string;
}

export const ACCOUNT_RELATION_CONSTRAINTS: IDatabaseConstraints = {
    relation: {
        keys: ['forward', 'reverse'],
        constraint: 'unique_relation',
        description: 'A relation already exists for these accounts',
    },
};

@Entity()
@Unique(ACCOUNT_RELATION_CONSTRAINTS.relation.constraint, ACCOUNT_RELATION_CONSTRAINTS.relation.keys)
export class AccountRelation extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    accountRelationId: number;

    @ManyToOne((type) => Account, (account) => account.forwardRelations, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'forwardAccountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    forward: Account; // Target

    @ManyToOne((type) => Account, (account) => account.reverseRelations, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reverseAccountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    reverse: Account; // Self

    @Column('jsonb', { nullable: false, default: {} })
    @ApiProperty({ type: () => AccountRelationData })
    data: AccountRelationData;

    @OneToMany((type) => AccountRelationDocument, (documents) => documents.relation)
    @ApiProperty({ type: 'object', description: 'AccountRelationDocument' })
    documents: AccountRelationDocument[];

    @Column('jsonb', { nullable: true })
    @ApiProperty({ type: 'object', title: 'AccountRelationReporting', description: 'AccountRelationReporting' })
    accountRelationReporting: AccountRelationReporting;

    static findWithMinimalRelations() {
        return this.createQueryBuilder('accountRelation')
            .leftJoin('accountRelation.forward', 'forward')
            .addSelect(['forward.accountId', 'forward.name'])
            .leftJoin('accountRelation.reverse', 'reverse')
            .addSelect(['reverse.accountId', 'reverse.name'])
            .leftJoinAndSelect('accountRelation.documents', 'accountRelationDocuments')
            .leftJoinAndSelect('accountRelationDocuments.document', 'document');
    }
}
