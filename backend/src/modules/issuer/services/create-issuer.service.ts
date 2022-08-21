import { Injectable } from '@nestjs/common';
import { CreateIssuerDto } from '@modules/issuer/controllers/issuer.controller';
import { Logger } from '@logger';
import { Issuer, ISSUER_CONSTRAINTS } from '@entities';
import { isNil, omitBy } from 'lodash';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';

@Injectable()
export class CreateIssuerService {
    constructor(private logger: Logger) {}

    async createIssuer(dto: CreateIssuerDto): Promise<Issuer> {
        this.logger.debug({ message: 'Creating Issuer', detail: dto, fn: this.createIssuer.name });
        const data = omitBy(dto, isNil);
        data.dump = dto;
        let issuer;

        try {
            issuer = await Issuer.create(data).save();
        } catch (e) {
            databaseExceptionHelper(e, ISSUER_CONSTRAINTS, 'Failed to create issuer, please contact the developers.');
        }
        this.logger.debug({ message: 'Created Issuer', detail: issuer, fn: this.createIssuer.name });
        return issuer;
    }
}
