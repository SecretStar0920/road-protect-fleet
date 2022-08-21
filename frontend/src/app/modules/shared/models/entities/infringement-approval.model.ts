import { Timestamped } from '@modules/shared/models/timestamped';
import { Transform, Type } from 'class-transformer';
import { Moment } from 'moment';
import { momentTransform } from '@modules/shared/transforms/moment.transform';
import { User } from '@modules/shared/models/entities/user.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

export enum InfringementApprovalAction {
    Approve = 'Approve For Payment',
    Unapprove = 'Unapprove for Payment',
}

export class InfringementApproval extends Timestamped {
    infringementApprovalId: number;

    @Type(() => Infringement)
    infringement: Infringement;

    @Type(() => Account)
    account: Account;

    @Type(() => User)
    user: User;

    action: InfringementApprovalAction;

    @Transform((val) => momentTransform(val))
    actionDate: Moment;

    amountDue: string;
}
