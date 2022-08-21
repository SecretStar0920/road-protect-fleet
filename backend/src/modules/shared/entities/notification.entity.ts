import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account, Infringement, TimeStamped } from '@entities';
import { Logger } from '@logger';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ApiProperty } from '@nestjs/swagger';

class CreateAndSaveNotificationParameters {
    @ApiProperty({ description: 'Account', type: 'object' })
    account: Account;
    @ApiProperty({ description: 'Infringement', type: 'object' })
    infringement: Infringement;
    @ApiProperty()
    message: string;
}

@Entity()
export class Notification extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    notificationId: number;

    @Column('text')
    @ApiProperty()
    message: string;

    @ManyToOne((type) => Account, (account) => account.notifications, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'accountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    account: Account;

    @ManyToOne((type) => Infringement, (infringement) => infringement.notifications, { nullable: true, onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    @Transactional()
    static async createAndSave(props: CreateAndSaveNotificationParameters) {
        this.create(props)
            .save()
            .catch((error) =>
                Logger.instance.error({ message: 'Failed to create a notification', detail: props, fn: 'Notification.createAndSave' }),
            );
    }
}
