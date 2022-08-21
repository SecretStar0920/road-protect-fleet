import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { PartialInfringement } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeletePartialInfringementService {
    constructor(private logger: Logger) {}

    async deletePartialInfringement(id: number): Promise<PartialInfringement> {
        const partialInfringement = await PartialInfringement.findOne(id);
        this.logger.debug({ message: 'Found Partial Infringement:', detail: id, fn: this.deletePartialInfringement.name });
        if (!partialInfringement) {
            this.logger.warn({
                message: 'Could not find Partial Infringement to delete',
                detail: id,
                fn: this.deletePartialInfringement.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E141_AccountNotFoundForRedirection.message() });
        }

        await PartialInfringement.remove(partialInfringement);
        return PartialInfringement.create({ partialInfringementId: id });
    }
}
