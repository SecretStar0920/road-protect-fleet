import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Infringement, InfringementNote } from '@entities';
import { getManager } from 'typeorm';
import { isNil } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { CreateInfringementNoteDto } from '@modules/infringement-note/dto/create-infringement-note.dto';

@Injectable()
export class CreateInfringementNoteService {
    constructor(private logger: Logger) {}

    async createInfringementNote(dto: CreateInfringementNoteDto, accountId?: number): Promise<InfringementNote> {
        this.logger.debug({ message: 'Creating InfringementNote', detail: dto, fn: this.createInfringementNote.name });
        const infringementNote = await getManager().transaction(async (transaction) => {
            const created = await this.createOnly(dto, accountId);
            const saved = await transaction.save(created);
            return saved;
        });
        this.logger.debug({ message: 'Saved InfringementNote', detail: infringementNote, fn: this.createInfringementNote.name });
        return infringementNote;
    }

    private async createOnly(dto: CreateInfringementNoteDto, accountId?: number): Promise<InfringementNote> {
        const infringement = await Infringement.createQueryBuilder('infringement')
            .where('infringement.infringementId = :infringementId', { infringementId: dto.infringementId })
            .getOne();
        if (isNil(infringement)) {
            throw new BadRequestException({
                message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: dto.infringementId }),
            });
        }
        let account: Account;
        if (accountId) {
            account = await Account.createQueryBuilder('account').where('account.accountId = :accountId', { accountId }).getOne();
        }

        return InfringementNote.create({
            value: dto.value,
            createdBy: account ? account : null,
            adminNote: dto.adminNote ?? false,
            infringement,
        });
    }
}
