import { Timestamped } from '@modules/shared/models/timestamped';
import { Type } from 'class-transformer';
import { Account } from '@modules/shared/models/entities/account.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

export class InfringementNote extends Timestamped {
    infringementNoteId: number;

    value: string;

    @Type(() => Account)
    createdBy: Account;

    @Type(() => Infringement)
    infringement: Infringement;

    adminNote: boolean;
}
