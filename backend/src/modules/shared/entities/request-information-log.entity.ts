import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { Account, Issuer, TimeStamped } from '@entities';
import { RequestInformationFromIssuerEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RequestInformationLogDetails {
    @ApiProperty({ type: () => RequestInformationFromIssuerEmail })
    requestEmailContext: RequestInformationFromIssuerEmail;
}

@Entity()
export class RequestInformationLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    requestInformationLogId: number;

    @Column('timestamptz')
    @ApiProperty()
    requestSendDate: string;

    @Column('timestamptz', { nullable: true })
    @ApiProperty()
    responseReceivedDate?: string;

    @Column('bool', { default: false, nullable: true })
    @ApiProperty()
    responseReceived?: boolean;

    @ManyToOne((type) => Account, (account) => account.accountRequestInformationLog, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ referencedColumnName: 'accountId', name: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    senderAccount: Account;

    @ManyToOne((type) => Issuer, (issuer) => issuer.issuerRequestInformationLog, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ referencedColumnName: 'issuerId', name: 'issuerId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Issuer' })
    issuer: Issuer;

    @Column('jsonb', { default: {} })
    @ApiProperty({ type: () => RequestInformationLogDetails })
    details?: RequestInformationLogDetails;

    static findWithMinimalRelations(): SelectQueryBuilder<RequestInformationLog> {
        return this.createQueryBuilder('information_request')
            .leftJoinAndSelect('information_request.issuer', 'issuer')
            .leftJoinAndSelect('information_request.senderAccount', 'senderAccount');
    }
}
