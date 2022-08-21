import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger, LoggerClass, LoggerMethod } from '@logger';
import { Infringement } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
@LoggerClass()
export class DeleteInfringementService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    @LoggerMethod()
    async deleteInfringement(id: number): Promise<Infringement> {
        const infringement = await Infringement.findOne(id);
        this.logger.logV2({ message: 'Deleting infringement:', detail: { infringement }, context: this });
        if (!infringement) {
            this.logger.warnV2({ message: 'Could not find Infringement to delete', detail: id, context: this });
            throw new BadRequestException({ message: ERROR_CODES.E053_CouldNotFindInfringementToDelete.message() });
        }

        await Infringement.remove(infringement);
        return Infringement.create({ infringementId: id });
    }

    @LoggerMethod()
    async softDeleteInfringement(id: number): Promise<Infringement> {
        const infringement = await Infringement.findOne(id);
        this.logger.logV2({ message: 'Found Infringement:', detail: id, context: this });
        if (!infringement) {
            this.logger.warnV2({ message: 'Could not find Infringement to delete', detail: id, context: this });
            throw new BadRequestException({ message: ERROR_CODES.E053_CouldNotFindInfringementToDelete.message() });
        }

        // infringement.active = false;
        await infringement.save();
        return infringement;
    }
}
