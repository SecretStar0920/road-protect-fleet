import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { InfringementNote } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteInfringementNoteService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteInfringementNote(id: number): Promise<InfringementNote> {
        this.logger.log({ message: 'Deleting Infringement Note:', detail: id, fn: this.deleteInfringementNote.name });
        const infringementNote = await InfringementNote.findOne(id);
        this.logger.log({ message: 'Found Infringement Note:', detail: id, fn: this.deleteInfringementNote.name });
        if (!infringementNote) {
            this.logger.warn({ message: 'Could not find Infringement Note to delete', detail: id, fn: this.deleteInfringementNote.name });
            throw new BadRequestException(ERROR_CODES.E004_CouldNotFindInfringementNoteToDelete.message());
        }

        await InfringementNote.remove(infringementNote);
        this.logger.log({ message: 'Deleted Infringement Note:', detail: id, fn: this.deleteInfringementNote.name });
        return InfringementNote.create({ infringementNoteId: id });
    }

    async softDeleteInfringementNote(id: number): Promise<InfringementNote> {
        this.logger.log({ message: 'Soft Deleting Infringement Note:', detail: id, fn: this.deleteInfringementNote.name });
        const infringementNote = await InfringementNote.findOne(id);
        this.logger.log({ message: 'Found Infringement Note:', detail: id, fn: this.deleteInfringementNote.name });
        if (!infringementNote) {
            this.logger.warn({ message: 'Could not find Infringement Note to delete', detail: id, fn: this.deleteInfringementNote.name });
            throw new BadRequestException(ERROR_CODES.E004_CouldNotFindInfringementNoteToDelete.message());
        }

        // infringementNote.active = false; // FIXME
        await infringementNote.save();
        this.logger.log({ message: 'Soft Deleted Infringement Note:', detail: id, fn: this.deleteInfringementNote.name });
        return infringementNote;
    }
}
