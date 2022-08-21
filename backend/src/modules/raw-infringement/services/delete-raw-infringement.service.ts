import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { RawInfringement } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteRawInfringementService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<RawInfringement> {
        this.logger.log({ message: 'Deleting Raw Infringement:', detail: id, fn: this.delete.name });
        const rawInfringement = await RawInfringement.findOne(id);
        this.logger.log({ message: 'Found Raw Infringement:', detail: id, fn: this.delete.name });
        if (!rawInfringement) {
            this.logger.warn({ message: 'Could not find Raw Infringement to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E150_CouldNotFindRawInfringementToDelete.message() });
        }

        await RawInfringement.remove(rawInfringement);
        this.logger.log({ message: 'Deleted Raw Infringement:', detail: id, fn: this.delete.name });
        return RawInfringement.create({ rawInfringementId: id });
    }

    async softDelete(id: number): Promise<RawInfringement> {
        this.logger.log({ message: 'Soft Deleting Raw Infringement:', detail: id, fn: this.delete.name });
        const rawInfringement = await RawInfringement.findOne(id);
        this.logger.log({ message: 'Found Raw Infringement:', detail: id, fn: this.delete.name });
        if (!rawInfringement) {
            this.logger.warn({ message: 'Could not find Raw Infringement to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E150_CouldNotFindRawInfringementToDelete.message() });
        }

        // rawInfringement.active = false; // FIXME
        await rawInfringement.save();
        this.logger.log({ message: 'Soft Deleted Raw Infringement:', detail: id, fn: this.delete.name });
        return rawInfringement;
    }
}
