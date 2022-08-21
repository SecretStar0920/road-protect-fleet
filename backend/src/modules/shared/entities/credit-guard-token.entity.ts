import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account, TimeStamped } from '@entities';
import { EncryptionHelper } from '@modules/shared/helpers/encryption.helper';
import { CreditGuardTokenDetails } from '@modules/payment/dtos/credit-guard-token.details';
import { isNil } from 'lodash';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
// Stores credit guard token information and is linked to by accounts primarily
// See page 17 of credit guard docs
export class CreditGuardToken extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    creditGuardTokenId: number;

    @Column('text')
    @ApiProperty()
    paymentReference: string;

    @Column('bool', { default: false })
    @ApiProperty()
    active: boolean;

    @Column('text', { nullable: true })
    @ApiProperty()
    cardMask?: string;

    @OneToOne((type) => Account, (account) => account.rpCreditGuard, { onDelete: 'CASCADE' })
    @ApiProperty({ type: 'object', description: 'Account' })
    accountRp: Account;

    @OneToOne((type) => Account, (account) => account.atgCreditGuard, { onDelete: 'CASCADE' })
    @ApiProperty({ type: 'object', description: 'Account' })
    accountAtg: Account;

    @Column('jsonb', { nullable: true, select: false })
    @ApiProperty({ description: 'CreditGuardTokenDetails' })
    raw: CreditGuardTokenDetails; // Note: this is encrypted on a database level

    @ApiProperty()
    isSecure: boolean = undefined; // Helps us to track whether the entity is currently encrypted or not

    @BeforeInsert()
    @BeforeUpdate()
    secureEntity() {
        if (this.isSecure === true || isNil(this.raw)) {
            return;
        }
        this.raw = EncryptionHelper.encryptJSON(this.raw) as any;
        this.isSecure = true;
    }

    @AfterLoad()
    @AfterUpdate()
    @AfterInsert()
    unsecureEntity() {
        if (isNil(this.raw) || this.isSecure === false) {
            return;
        }
        this.raw = EncryptionHelper.decryptJSON(this.raw as any);
        this.isSecure = false;
    }
}
