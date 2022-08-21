import { ChildEntity, SelectQueryBuilder } from 'typeorm';
import { Payment, PaymentType } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@ChildEntity()
export class ExternalPayment extends Payment {
    @ApiProperty({ default: PaymentType.External })
    type = PaymentType.External;

    static findWithMinimalRelations(): SelectQueryBuilder<ExternalPayment> {
        return this.createQueryBuilder('payment').leftJoinAndSelect('payment.infringement', 'infringement');
    }
}
