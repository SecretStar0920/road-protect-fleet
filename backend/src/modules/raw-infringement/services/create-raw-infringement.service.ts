import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Client, Infringement, RawInfringement } from '@entities';
import { getManager } from 'typeorm';
import { isObject, isString } from 'lodash';
import { RawInfringementMapperService } from '@modules/raw-infringement/services/raw-infringement-mapper.service';

@Injectable()
export class CreateRawInfringementService {
    constructor(private logger: Logger, private rawInfringementMapper: RawInfringementMapperService) {}

    async createRawInfringement(body: any, client: Client): Promise<{ raw: RawInfringement; infringement?: Infringement }> {
        this.logger.debug({ message: 'Creating Raw Infringement', detail: body, fn: this.createRawInfringement.name });
        const rawInfringement = await getManager().transaction(async (transaction) => {
            const created = await this.createOnly(body, client);
            return await transaction.save(created);
        });
        this.logger.debug({ message: 'Saved RawInfringement', detail: rawInfringement, fn: this.createRawInfringement.name });

        let infringement: Infringement;
        try {
            infringement = await this.rawInfringementMapper.mapAndCreateOrUpdate(rawInfringement, client);
        } catch (e) {
            this.logger.error({
                message: 'Failed to map infringement on create, fix mapper or data and re-run the pending raw infringement',
                detail: e,
                fn: this.createRawInfringement.name,
            });
        }
        return { raw: rawInfringement, infringement };
    }

    async createOnly(body: any, client: Client): Promise<RawInfringement> {
        let data: any = {};

        if (isString(body)) {
            data.received = body;
        } else if (isObject(body)) {
            data = body;
        } else {
            this.logger.warn({ message: 'RawInfringement body is not a compatible format', detail: body, fn: this.createOnly.name });
        }

        return RawInfringement.create({
            data,
            client,
        });
    }
}
