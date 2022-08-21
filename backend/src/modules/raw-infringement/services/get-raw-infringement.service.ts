import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { RawInfringement } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetRawInfringementService {
    constructor(private logger: Logger) {}

    async get(rawInfringementId: number): Promise<RawInfringement> {
        this.logger.log({ message: `Getting RawInfringement with id: `, detail: rawInfringementId, fn: this.get.name });
        const rawInfringement = await RawInfringement.createQueryBuilder('rawInfringement')
            .andWhere('rawInfringement.rawInfringementId = :id', { id: rawInfringementId })
            .getOne();
        if (!rawInfringement) {
            throw new BadRequestException({ message: ERROR_CODES.E151_CouldNotFindRawInfringement.message({ rawInfringementId }) });
        }
        this.logger.log({ message: `Found RawInfringement with id: `, detail: rawInfringement.rawInfringementId, fn: this.get.name });
        return rawInfringement;
    }
}
