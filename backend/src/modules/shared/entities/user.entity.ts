import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, SelectQueryBuilder, Unique } from 'typeorm';
import { AccountUser, AuditLog, Infringement, InfringementApproval, Job, Log, TimeStamped } from '@entities';
import { isNil } from 'lodash';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

export enum UserType {
    Admin = 'Admin',
    Developer = 'Developer',
    Standard = 'Standard',
    API = 'API',
}

export class TablePreset {
    @IsDefined()
    @ApiProperty()
    id: number;
    @IsDefined()
    @ApiProperty()
    name: string;
    @IsDefined()
    @ApiProperty()
    filters: { [key: string]: any };
    @IsDefined()
    @ApiProperty()
    columns: string[];
    @IsDefined()
    @ApiProperty()
    default: boolean;
}

export class UserPreset {
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    infringementTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    contractTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    vehicleTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    accountUserTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    relationTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    reportTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    userTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    accountsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    nominationsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    issuerTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    paymentsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    driverTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    integrationRequestLogsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    jobLogsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    rawInfringementLogsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    infoRequestLogsTable?: TablePreset[];
    @IsOptional()
    @ApiProperty({ type: 'object', description: 'TablePreset[]' })
    partialInfringementTable?: TablePreset[];
}
export const USER_CONSTRAINTS: IDatabaseConstraints = {
    email: {
        keys: ['email'],
        constraint: 'unique_email',
        description: 'An account with this email already exists',
    },
};

@Entity()
@Unique(USER_CONSTRAINTS.email.constraint, USER_CONSTRAINTS.email.keys)
export class User extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    userId: number;

    @Column('text')
    @ApiProperty()
    name: string;

    @Column('text')
    @ApiProperty()
    surname: string;

    @Column('text')
    @ApiProperty()
    email: string;

    @Column('text', { nullable: true })
    @ApiProperty()
    cellphoneNumber: string;

    @Column('text', { select: false })
    @ApiProperty()
    password: string;

    @Column('enum', { enum: UserType, default: UserType.Standard })
    @ApiProperty({ enum: UserType, default: UserType.Standard })
    type: UserType;

    @Column('bool', { default: false })
    @ApiProperty()
    completedSignup: boolean;

    @Column({ default: 0 })
    @ApiProperty()
    loginAttempts: number;

    @Column('jsonb', { default: {} })
    @ApiProperty({ description: 'UserPreset', type: 'object' })
    frontendUserPreferences: UserPreset;
    // Relations

    @OneToMany((type) => AccountUser, (accountUser) => accountUser.user)
    @ApiProperty({ description: 'AccountUser[]', type: 'object' })
    accounts: AccountUser[];

    @OneToMany((type) => Log, (log) => log.user)
    @ApiProperty({ description: 'Log[]', type: 'object' })
    logs: Log[];

    @OneToMany((type) => AuditLog, (auditLog) => auditLog.user)
    @ApiProperty({ description: 'Log[]', type: 'object' })
    auditLogs: AuditLog[];

    @OneToMany((type) => Job, (job) => job.user)
    @ApiProperty({ description: 'Job[]', type: 'object' })
    jobs: Job[];

    @OneToMany((type) => InfringementApproval, (infringementApproval) => infringementApproval.user)
    @ApiProperty({ description: 'InfringementApproval[]', type: 'object' })
    infringementApproval: InfringementApproval[];

    @OneToMany((type) => Infringement, (infringement) => infringement.user)
    @ApiProperty({ type: 'object', description: 'Infringement[]' })
    infringement: Infringement[];

    async getPassword(): Promise<string> {
        const user = await User.findOne(this.userId, { select: ['password'] });
        return user.password;
    }

    get firstName(): string {
        if (!isNil(this.name)) {
            return this.name.split(' ')[0];
        }

        return 'N/A';
    }

    static async getAdmins(): Promise<User[]> {
        return this.createQueryBuilder('user')
            .select(['user.userId', 'user.name', 'user.email'])
            .andWhere('user.type = :admin', { admin: UserType.Admin })
            .orWhere('user.type = :developer', { developer: UserType.Developer })
            .getMany();
    }

    static findByEmail(email: string): SelectQueryBuilder<User> {
        return this.createQueryBuilder('user').andWhere('user.email = :email', { email });
    }

    static findWithMinimalRelations(): SelectQueryBuilder<User> {
        return this.createQueryBuilder('user')
            .leftJoin('user.accounts', 'accountUsers')
            .addSelect(['accountUsers.accountUserId'])
            .leftJoin('accountUsers.account', 'account')
            .addSelect(['account.accountId', 'account.name', 'account.identifier']);
    }
}
