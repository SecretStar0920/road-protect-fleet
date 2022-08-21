import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { RawInfringement } from '@entities';

@Injectable()
export class GetRawInfringementsService {
    constructor(private logger: Logger) {}

    async get(): Promise<RawInfringement[]> {
        this.logger.log({ message: `Getting Raw Infringements`, detail: null, fn: this.get.name });
        const rawInfringements = await RawInfringement.createQueryBuilder('rawInfringement').getMany();
        this.logger.log({ message: `Found Raw Infringements, length: `, detail: rawInfringements.length, fn: this.get.name });
        return rawInfringements;
    }
}
