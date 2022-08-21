import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { Account, TimeStamped, User } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

export class AuditLogAction {
    @ApiProperty()
    route: string;
    @ApiProperty()
    url: string;
    @ApiProperty()
    method: string;
    @ApiProperty()
    friendlyName?: string;
    @ApiProperty()
    body?: any;
    @ApiProperty()
    response?: any;
}

@Entity()
export class AuditLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    auditLogId: number;

    @Column('bool', { default: true })
    @ApiProperty()
    success?: boolean;

    @ManyToOne((type) => User, (user) => user.auditLogs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ referencedColumnName: 'userId', name: 'userId' })
    @Index()
    @ApiProperty({ description: 'User', type: 'object' })
    user: User;

    @ManyToOne((type) => Account, (account) => account.userAuditLogs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ referencedColumnName: 'accountId', name: 'accountId' })
    @Index()
    @ApiProperty({ description: 'Account', type: 'object' })
    forAccount: Account;

    @Column('jsonb', { default: {} })
    @ApiProperty({ type: () => AuditLogAction })
    action: AuditLogAction;

    static findWithMinimalRelations(): SelectQueryBuilder<AuditLog> {
        return this.createQueryBuilder('auditLog').leftJoin('auditLog.user', 'user').addSelect(['user.email', 'user.userId', 'user.name']);
    }
}
