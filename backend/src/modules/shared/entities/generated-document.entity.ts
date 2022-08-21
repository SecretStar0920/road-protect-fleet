import { Document, DocumentTemplate, DocumentTemplateForm, TimeStamped } from '@entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GeneratedDocument extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    generatedDocumentId: number;

    @ManyToOne((type) => DocumentTemplate, (documentTemplate) => documentTemplate.generatedDocuments, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @ApiProperty({ type: 'object', description: 'DocumentTemplate' })
    documentTemplate: DocumentTemplate;

    @Column('jsonb', { nullable: false })
    @ApiProperty({ type: 'object', description: 'DocumentTemplateForm' })
    form: DocumentTemplateForm;

    @Column('bool', { default: false })
    @ApiProperty()
    complete: boolean;

    @OneToOne((type) => Document, (document) => document.generatedDocument, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @ApiProperty({ type: 'object', description: 'Document' })
    document: Document;

    static findWithMinimalRelations() {
        return this.createQueryBuilder('generatedDocument')
            .leftJoinAndSelect('generatedDocument.document', 'document')
            .leftJoinAndSelect('generatedDocument.documentTemplate', 'documentTemplate');
    }
}
