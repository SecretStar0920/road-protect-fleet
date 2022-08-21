import { Injectable } from '@nestjs/common';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Nomination } from '@entities';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';

@Injectable()
export class UpdateNominationService {
    constructor(private logger: Logger) {}

    /**
     * NOTE: unused
     */
    async update(id: number, dto: NominationDto): Promise<Nomination> {
        this.logger.log({ message: 'Updating Nomination: ', detail: merge({ id }, dto), fn: this.update.name });
        let nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId: id })
            .getOne();
        nomination = merge(nomination, dto);
        await nomination.save();
        this.logger.log({ message: 'Updated Nomination: ', detail: id, fn: this.update.name });
        return nomination;
    }
}
