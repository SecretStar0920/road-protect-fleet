import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountRelation, Document, TimeStamped } from '@entities';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { ApiProperty } from '@nestjs/swagger';

export const ACCOUNT_RELATION_DOCUMENT_CONSTRAINTS: IDatabaseConstraints = {};

export enum AccountRelationDocumentType {
    PA = 'Power of Attorney',
    Other = 'Other',
}

@Entity()
export class AccountRelationDocument extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    accountRelationDocumentId: number;

    @Column('enum', { enum: AccountRelationDocumentType, nullable: false, default: AccountRelationDocumentType.Other })
    @ApiProperty({ enum: AccountRelationDocumentType, nullable: false, default: AccountRelationDocumentType.Other })
    type: AccountRelationDocumentType;

    @ManyToOne((type) => AccountRelation, (relation) => relation.documents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'accountRelationId', referencedColumnName: 'accountRelationId' })
    @ApiProperty({ description: 'AccountRelation', type: 'object' })
    relation: AccountRelation;

    @ManyToOne((type) => Document, (document) => document.relations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @ApiProperty({ description: 'Document', type: 'object' })
    document: Document;

    static findWithMinimalRelations() {
        return this.createQueryBuilder('relation_document')
            .leftJoinAndSelect('relation_document.document', 'document')
            .leftJoinAndSelect('relation_document.relation', 'accountRelation');
    }
}
