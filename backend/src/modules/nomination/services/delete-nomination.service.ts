import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Nomination } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteNominationService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteNomination(id: number): Promise<Nomination> {
        this.logger.log({ message: 'Deleting Nomination:', detail: id, fn: this.deleteNomination.name });
        const nomination = await Nomination.findOne(id);
        this.logger.log({ message: 'Found Nomination:', detail: id, fn: this.deleteNomination.name });
        if (!nomination) {
            this.logger.warn({ message: 'Could not find Nomination to delete', detail: id, fn: this.deleteNomination.name });
            throw new BadRequestException({ message: ERROR_CODES.E138_CouldNotFindNominationToDelete.message() });
        }

        await Nomination.remove(nomination);
        this.logger.log({ message: 'Deleted Nomination:', detail: id, fn: this.deleteNomination.name });
        return Nomination.create({ nominationId: id });
    }

    async softDeleteNomination(id: number): Promise<Nomination> {
        this.logger.log({ message: 'Soft Deleting Nomination:', detail: id, fn: this.deleteNomination.name });
        const nomination = await Nomination.findOne(id);
        this.logger.log({ message: 'Found Nomination:', detail: id, fn: this.deleteNomination.name });
        if (!nomination) {
            this.logger.warn({ message: 'Could not find Nomination to delete', detail: id, fn: this.deleteNomination.name });
            throw new BadRequestException({ message: ERROR_CODES.E138_CouldNotFindNominationToDelete.message() });
        }

        // nomination.active = false;
        await nomination.save();
        this.logger.log({ message: 'Soft Deleted Nomination:', detail: id, fn: this.deleteNomination.name });
        return nomination;
    }
}
