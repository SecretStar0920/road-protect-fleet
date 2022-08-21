import {
    Client,
    Infringement,
    InfringementCreationMethod,
    InfringementStatus,
    ManualPayment,
    RawInfringement,
    RawInfringementStatus,
} from '@entities';
import { Logger } from '@logger';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { AtgRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/atg/atg-raw-infringement.mapper';
import { AtgVerificationRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/atg/atg-verification-raw-infringement.mapper';
import { JerusalemRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/jerusalem-raw-infringement.mapper';
import { MetroparkRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/metropark-raw-infringement.mapper';
import { KfarSabaRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/kfarSaba-raw-infringement.mapper';
import { MileonRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/mileon-raw-infringement.mapper';
import { PoliceRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/police-raw-infringement.mapper';
import { TelavivRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/telaviv-raw-infringement.mapper';
import { OldIsraelFleetRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement.mapper';
import { RawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/raw-infringement.mapper';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ShoharRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/shohar-raw-infringement.mapper';
import { City4uRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/crawlers/city4u-raw-infringement.mapper';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';


@Injectable()
export class RawInfringementMapperService {
    constructor(
        private logger: Logger,
        private createInfringementService: CreateInfringementService,
        private updateInfringementService: UpdateInfringementService,
        private upsertInfringementNoteService: UpsertInfringementNoteService,
    ) {}

    async mapAndCreateOrUpdate(raw: RawInfringement, client: Client): Promise<Infringement> {
        // Get mapper
        const mapper = this.getClientMapper(client);

        if (!mapper) {
            raw.status = RawInfringementStatus.Failed;
            raw.result = { message: 'No mapper for this client' };
            throw new InternalServerErrorException({ message: ERROR_CODES.E111_NoMapperForClient.message() });
        }

        this.logger.debug({
            message: 'Creating/updating infringement',
            fn: this.mapAndCreateOrUpdate.name,
            detail: { raw, client: client.name },
        });

        try {
            // Ask mapper if infringement already exists
            const infringementExists = await mapper.isExistingInfringement(raw);
            // Update if exists
            let infringement: Infringement;
            if (infringementExists.exists) {
                this.logger.debug({
                    message: 'Update existing infringement',
                    fn: this.mapAndCreateOrUpdate.name,
                    detail: infringementExists,
                });
                infringement = await this.updateExisting(mapper, raw, infringementExists);
            } else {
                this.logger.debug({ message: 'Create new infringement', fn: this.mapAndCreateOrUpdate.name, detail: infringementExists });
                infringement = await this.createNew(mapper, raw);
            }
            return infringement;
        } catch (e) {
            raw.status = RawInfringementStatus.Failed;
            raw.result = e;
            await raw.save();
            this.logger.error({
                message: 'Error creating/updating infringement from raw',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.mapAndCreateOrUpdate.name,
            });
        }
    }

    private async createNew(mapper: RawInfringementMapper, raw: RawInfringement): Promise<Infringement> {
        // Create
        try {
            const result = await mapper.getCreateInfringementDto(raw);
            const additionalNominationDetails = await mapper.getNominationDtoFromRawInfringement(raw);
            const infringement = await this.createInfringementService.createInfringement(
                result,
                additionalNominationDetails,
                InfringementCreationMethod.Crawler,
            );
            // Upsert infringement notes - infringement needs to be created and saved before linking a note
            if (result.note) {
                await this.upsertInfringementNoteService.upsertInfringementNote({ value: result.note }, null, infringement);
            }

            // Check if status is being set to Outstanding
            if (infringement.status === InfringementStatus.Outstanding) {
                this.logger.debug({
                    message: 'Creating an Infringement with an Outstanding status',
                    detail: {
                        raw,
                        infringement,
                        result,
                    },
                    fn: this.createNew.name,
                });
            }

            raw.result = { result, infringement };
            raw.status = RawInfringementStatus.Completed;
            await raw.save();
            this.logger.debug({ message: 'Created infringement from raw', fn: this.mapAndCreateOrUpdate.name });
            return infringement;
        } catch (e) {
            raw.status = RawInfringementStatus.Failed;
            raw.result = e;
            await raw.save();
            this.logger.error({
                message: 'Error creating infringement from raw',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.mapAndCreateOrUpdate.name,
            });
        }
    }

    private async updateExisting(
        mapper: RawInfringementMapper,
        raw: RawInfringement,
        infringementExists: { infringementId: number; exists: boolean },
    ): Promise<Infringement> {
        try {
            const result = await mapper.getUpdateInfringementDto(raw);
            const additionalNominationDetails = await mapper.getNominationDtoFromRawInfringement(raw);
            let infringement: Infringement;
            if (result.perform) {
                infringement = await this.updateInfringementService.updateInfringement(
                    infringementExists.infringementId,
                    result.dto,
                    additionalNominationDetails,
                );
                this.logger.debug({
                    message: 'Updated infringement from raw',
                    detail: { infringement },
                    fn: this.mapAndCreateOrUpdate.name,
                });
            }

            raw.result = { result, infringement };
            raw.status = RawInfringementStatus.Completed;
            await raw.save();
            return infringement;
        } catch (e) {
            raw.status = RawInfringementStatus.Failed;
            raw.result = e;
            await raw.save();
            this.logger.error({
                message: 'Error updating infringement from raw',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.mapAndCreateOrUpdate.name,
            });
            return null;
        }
    }

    async mapAndCreatePendingRawInfringements(client: Client): Promise<void> {
        const pendingRawInfringements = await RawInfringement.createQueryBuilder('rawInfringement')
            .leftJoinAndSelect('rawInfringement.client', 'client')
            .andWhere('rawInfringement.status = :status', { status: RawInfringementStatus.Pending })
            .andWhere('client.name = :client', { client: client.name })
            .getMany();
        for (const pendingRawInfringement of pendingRawInfringements) {
            await this.mapAndCreateOrUpdate(pendingRawInfringement, client);
        }
    }

    async mapRawInfringementByStatus(status: RawInfringementStatus, client: Client): Promise<void> {
        const pendingRawInfringements = await RawInfringement.createQueryBuilder('rawInfringement')
            .leftJoinAndSelect('rawInfringement.client', 'client')
            .andWhere('rawInfringement.status = :status', { status })
            .andWhere('client.clientId = :client', { client: client.clientId })
            .getMany();
        this.logger.debug({
            message: `Found ${pendingRawInfringements.length} raw infringements to reprocess for status ${status}`,
            fn: this.mapRawInfringementByStatus.name,
        });
        for (const pendingRawInfringement of pendingRawInfringements) {
            await this.mapAndCreateOrUpdate(pendingRawInfringement, pendingRawInfringement.client);
        }
    }

    getClientMapper(client: Client): RawInfringementMapper {
        const mappers = {
            atg: new AtgRawInfringementMapper(this.logger),
            'atg-verification': new AtgVerificationRawInfringementMapper(this.logger),
            'old-israel-fleet': new OldIsraelFleetRawInfringementMapper(this.logger),
            'jerusalem-crawler': new JerusalemRawInfringementMapper(this.logger),
            'telaviv-crawler': new TelavivRawInfringementMapper(this.logger),
            'mileon-crawler': new MileonRawInfringementMapper(this.logger),
            'metropark-crawler': new MetroparkRawInfringementMapper(this.logger),
            'kfarSaba-crawler': new KfarSabaRawInfringementMapper(this.logger),
            'police-crawler': new PoliceRawInfringementMapper(this.logger),
            'shohar-crawler': new ShoharRawInfringementMapper(this.logger),
            'city4u-crawler': new City4uRawInfringementMapper(this.logger),
        };
        if (mappers.hasOwnProperty(client.name)) {
            return mappers[client.name];
        }
        this.logger.warn({ message: `Couldn't find client mapper for ${client.name}`, detail: null, fn: this.getClientMapper.name });
        return;
    }
}
