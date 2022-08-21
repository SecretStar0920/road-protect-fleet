import { ChildEntity, Column, SelectQueryBuilder } from 'typeorm';
import { Payment, PaymentType } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

export enum IntegrationPaymentStatus {
    Pending = 'Pending',
    Successful = 'Successful',
    Failed = 'Failed',
}

@ChildEntity()
export class IntegrationPayment extends Payment {
    @Column('text')
    @ApiProperty()
    provider: string;

    @Column('enum', { enum: IntegrationPaymentStatus })
    @ApiProperty({ enum: IntegrationPaymentStatus })
    status: IntegrationPaymentStatus;

    @ApiProperty({ default: PaymentType.Municipal })
    type = PaymentType.Municipal;

    static findWithMinimalRelations(): SelectQueryBuilder<IntegrationPayment> {
        return this.createQueryBuilder('payment').leftJoinAndSelect('payment.infringement', 'infringement');
    }
}
