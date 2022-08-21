import { Injectable } from '@nestjs/common';
import { UpdateRawInfringementDto } from '@modules/raw-infringement/controllers/client-raw-infringement.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { RawInfringement } from '@entities';

@Injectable()
export class UpdateRawInfringementService {
    constructor(private logger: Logger) {}

    async update(id: number, dto: UpdateRawInfringementDto): Promise<RawInfringement> {
        this.logger.log({ message: 'Updating Raw Infringement: ', detail: merge({ id }, dto), fn: this.update.name });
        let rawInfringement = await RawInfringement.findOne(id);
        rawInfringement = merge(rawInfringement, dto);
        await rawInfringement.save();
        this.logger.log({ message: 'Updated Raw Infringement: ', detail: id, fn: this.update.name });
        return rawInfringement;
    }
}
