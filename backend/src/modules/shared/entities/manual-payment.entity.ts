import { ChildEntity, Column, JoinColumn, OneToOne, SelectQueryBuilder } from 'typeorm';
import { Document, Payment, PaymentType } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@ChildEntity()
export class ManualPayment extends Payment {
    @Column('text', { nullable: false })
    @ApiProperty()
    referenceNumber: string;

    @OneToOne((type) => Document, (document) => document.manualPayment, { nullable: true })
    @JoinColumn({ name: 'documentId', referencedColumnName: 'documentId' })
    @ApiProperty({ type: 'object', description: 'Document' })
    document: Document;

    @ApiProperty({ default: PaymentType.Manual })
    type = PaymentType.Manual;

    static findWithMinimalRelations(): SelectQueryBuilder<ManualPayment> {
        return this.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.infringement', 'infringement')
            .leftJoinAndSelect('payment.document', 'document');
    }
}
