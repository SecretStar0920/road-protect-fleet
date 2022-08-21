import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account, Infringement, TimeStamped, User } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Logger } from '@logger';
import * as moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

export enum InfringementApprovalAction {
    Approve = 'Approve For Payment',
    Unapprove = 'Unapprove for Payment',
}

class CreateAndSaveInfringementApprovalParameters {
    user?: User;
    account?: Account;
    infringement: Infringement;
    action: InfringementApprovalAction;
}

@Entity()
export class InfringementApproval extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    infringementApprovalId: number;

    @ManyToOne((type) => Infringement, (infringement) => infringement.infringementApproval)
    @JoinColumn({ name: 'infringementId', referencedColumnName: 'infringementId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Infringement' })
    infringement: Infringement;

    @ManyToOne((type) => Account, (account) => account.infringementApproval)
    @JoinColumn({ name: 'accountId', referencedColumnName: 'accountId' })
    @ApiProperty({ type: 'object', description: 'Account' })
    account: Account;

    @ManyToOne((type) => User, (user) => user.infringementApproval, { nullable: true })
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    @ApiProperty({ type: 'object', description: 'User' })
    user: User;

    @Column('enum', { enum: InfringementApprovalAction })
    @ApiProperty({ enum: InfringementApprovalAction })
    action: InfringementApprovalAction;

    @Column('timestamptz', { nullable: true })
    @Index()
    @ApiProperty()
    actionDate: string;

    @Column('numeric', { precision: 12, scale: 2 })
    @Index()
    @ApiProperty()
    amountDue: string; // amount owed at the time that the action is performed

    @Transactional()
    static async createAndSave(props: CreateAndSaveInfringementApprovalParameters) {
        Logger.instance.debug({
            message: 'Creating an infringement approval action',
            detail: props,
            fn: 'InfringementApproval.createAndSave',
        });

        this.create({ ...props, amountDue: props.infringement?.amountDue, actionDate: moment().toISOString() })
            .save()
            .catch((error) =>
                Logger.instance.error({
                    message: 'Failed to create an infringement approval entry',
                    detail: props,
                    fn: 'InfringementApproval.createAndSave',
                }),
            );
    }
}
