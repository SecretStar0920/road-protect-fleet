import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    SelectQueryBuilder,
    TableInheritance,
} from 'typeorm';
import { Infringement, TimeStamped } from '@entities';
import { EncryptionHelper } from '@modules/shared/helpers/encryption.helper';
import { isNil } from 'lodash';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentType {
    Municipal = 'Municipal',
    Manual = 'Manual',
    External = 'External',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Payment extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    paymentId: number;

    @Column('jsonb', { default: {} })
    @ApiProperty()
    details: any; // NOTE: this is encrypted on a database level. TODO: type

    @Column({ nullable: true })
    @ApiProperty()
    amountPaid: string;

    @Column({ nullable: true })
    @ApiProperty()
    externalReference: string;

    @ManyToOne((type) => Infringement, (infringement) => infringement.payments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ description: 'Infringement', type: 'object' })
    infringement: Infringement;

    @OneToOne((type) => Infringement, (infringement) => infringement.lastSuccessfulPayment, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'successfulInfringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Infringement' })
    successfulInfringement: Infringement;

    @Column('timestamptz', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    @ApiProperty()
    paymentDate: string;

    @ApiProperty({ enum: PaymentType })
    abstract type: PaymentType;

    static findWithMinimalRelations(): SelectQueryBuilder<Payment> {
        return this.createQueryBuilder('payment').leftJoinAndSelect('payment.infringement', 'infringement');
    }

    @ApiProperty()
    isSecure: boolean = undefined;

    @BeforeInsert()
    @BeforeUpdate()
    secureEntity() {
        if (this.isSecure === true || isNil(this.details)) {
            return;
        }
        this.details = EncryptionHelper.encryptJSON(this.details) as any;
        this.isSecure = true;
    }

    @AfterLoad()
    @AfterUpdate()
    @AfterInsert()
    unsecureEntity() {
        if (this.isSecure === false || isNil(this.details)) {
            return;
        }
        this.details = EncryptionHelper.decryptJSON(this.details as any);
        this.isSecure = false;
    }
}
