import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { Account, Infringement, TimeStamped, User, Vehicle } from '@entities';
import { Logger } from '@logger';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { AsyncStorageHelper } from '@middleware/async-local-storage.middleware';
import { LogParameters } from '@modules/log/services/log.service';
import { ApiProperty } from '@nestjs/swagger';

export enum LogType {
    Created = 'Created',
    Success = 'Success',
    Error = 'Error',
    Updated = 'Updated',
    Warning = 'Warning',
}

export enum LogPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

class CreateAndSaveLogParameters {
    @ApiProperty({ description: 'Vehicle', type: 'object' })
    vehicle?: Vehicle;
    @ApiProperty({ description: 'User', type: 'object' })
    user?: User;
    @ApiProperty({ description: 'Account', type: 'object' })
    account?: Account;
    @ApiProperty({ description: 'Infringement', type: 'object' })
    infringement?: Infringement;
    @ApiProperty({ enum: LogType })
    type: LogType;
    @ApiProperty()
    message: string;
    @ApiProperty({ enum: LogPriority })
    priority?: LogPriority;
}

@Entity()
export class Log extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    logId: number;

    @Column('enum', { enum: LogType })
    @ApiProperty({ enum: LogType })
    type: LogType;

    @Column('enum', { enum: LogPriority, default: LogPriority.Low })
    @ApiProperty({ enum: LogPriority })
    priority: LogPriority;

    @Column('text')
    @ApiProperty()
    message: string;

    @ManyToOne((type) => User, (user) => user.logs, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    @Index()
    @ApiProperty()
    user: User;
    //
    // @Column('int', { name: 'userId' })
    // userId: number;

    @ManyToOne((type) => Account, (account) => account.logs, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'accountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ description: 'Account', type: 'object' })
    account: Account;
    //
    // @Column('int', { name: 'accountId' })
    // accountId: number;

    @ManyToOne((type) => Vehicle, (vehicle) => vehicle.logs, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'vehicleId', referencedColumnName: 'vehicleId' })
    @Index()
    @ApiProperty()
    vehicle: Vehicle;
    //
    // @Column('int', { name: 'vehicleId' })
    // vehicleId: number;

    @ManyToOne((type) => Infringement, (infringement) => infringement.logs, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ description: 'Infringement', type: 'object' })
    infringement: Infringement;
    //
    // @Column('int', { name: 'infringementId' })
    // infringementId: number;

    static async createAndSave(props: CreateAndSaveLogParameters) {
        // Getting user implementing change

        if (!props.user) {
            try {
                const store = AsyncStorageHelper.getStoreSafe();
                const userIdentity = store.identity();
                props.user = userIdentity.user;
            } catch (error) {
                Logger.instance.debug({
                    message: 'Could not add user',
                    detail: error,
                    fn: 'Log.createAndSave',
                });
            }
        }

        if (!props.priority && (props.type === LogType.Error || props.type === LogType.Warning)) {
            props.priority = LogPriority.High;
        } else if (!props.priority) {
            props.priority = LogPriority.Low;
        }

        Logger.instance.debug({
            message: 'Creating infringement log',
            fn: 'Log.createAndSave',
        });

        try {
            await Log.create({
                vehicle: props.vehicle ? props.vehicle : null,
                user: props.user ? props.user : null,
                account: props.account ? props.account : null,
                infringement: props.infringement ? props.infringement : null,
                type: props.type,
                message: props.message ? props.message : null,
                priority: props.priority,
            }).save();
        } catch (error) {
            Logger.instance.error({ message: 'Failed to create a log', detail: props, fn: 'Log.createAndSave' });
        }
    }

    static findWithHistory(params: LogParameters): SelectQueryBuilder<Log> {
        const query = this.createQueryBuilder('log')
            .leftJoin('log.vehicle', 'vehicle')
            .addSelect(['vehicle.registration'])
            .leftJoin('log.account', 'account')
            .addSelect(['account.name'])
            .leftJoin('log.user', 'user')
            .addSelect(['user.name'])
            .leftJoin('log.infringement', 'infringement')
            .addSelect(['infringement.noticeNumber'])
            // Infringement History
            .leftJoinAndSelect(
                'infringement.infringementRevisionHistory',
                'infringementRevisionHistory',
                'log.updatedAt  = infringementRevisionHistory.timestamp AND log.type = :type ',
                {
                    type: LogType.Updated,
                },
            );

        if (params.vehicleId) {
            query.andWhere('vehicle.vehicleId = :vehicleId', { vehicleId: String(params.vehicleId) });
        }
        if (params.accountId) {
            query.andWhere('account.accountId = :accountId', { accountId: String(params.accountId) });
        }
        if (params.userId) {
            query.andWhere('user.userId = :userId', { userId: String(params.userId) });
        }
        if (params.infringementId) {
            query.andWhere('infringement.infringementId = :infringementId', { infringementId: String(params.infringementId) });
        }

        query.orderBy('log.logId', 'DESC').take(100);
        return query;
    }
}
