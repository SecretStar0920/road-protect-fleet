import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { InfringementNote } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetInfringementNoteService {
    constructor(private logger: Logger) {}

    async getInfringementNote(infringementNoteId: number): Promise<InfringementNote> {
        this.logger.log({ message: `Getting InfringementNote with id: `, detail: infringementNoteId, fn: this.getInfringementNote.name });
        const infringementNote = await InfringementNote.createQueryBuilder('infringementNote')
            .andWhere('infringementNote.infringementNoteId = :id', { id: infringementNoteId })
            .getOne();
        if (!infringementNote) {
            throw new BadRequestException(ERROR_CODES.E011_CouldNotFindInfringementNote.message({ infringementNoteId }));
        }
        this.logger.log({
            message: `Found InfringementNote with id: `,
            detail: infringementNote.infringementNoteId,
            fn: this.getInfringementNote.name,
        });
        return infringementNote;
    }
}
