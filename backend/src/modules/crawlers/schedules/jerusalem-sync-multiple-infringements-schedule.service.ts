import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { InfringementStatus, Vehicle } from '@entities';
import { Logger } from '@logger';
import { JerusalemSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/jerusalem-sync-multiple-infringements.job';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class JerusalemSyncMultipleInfringementsScheduleService {
    constructor(private logger: Logger, private jerusalemSyncJob: JerusalemSyncMultipleInfringementsJob) {}

    // TODO: Correct the time interval here
    //@Cron('0 5 * * *', { name: 'jerusalem_crawler_sync' })
    async sync() {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `Jerusalem scheduled sync not enabled`,
                fn: this.sync.name,
            });
            return;
        }
        this.logger.debug({
            message: `Running Jerusalem crawler sync`,
            fn: this.sync.name,
        });

        try {
            await this.syncRedirections();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the redirection sync on Jerusalem ${e.message}`,
            });
        }

        try {
            await this.syncStandard();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the standard sync on Jerusalem ${e.message}`,
            });
        }
    }

    private async syncRedirections() {
        // Query to get all vehicles which have at least one infringement in Jerusalem
        const vehicleIdentifierCombinations = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.infringements', 'infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Jerusalem,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .innerJoin('infringement.nomination', 'nomination')
            .andWhere('nomination.rawRedirectionIdentifier is not null')
            .select('vehicle.registration', 'registration')
            .addSelect('nomination.rawRedirectionIdentifier', 'identifier')
            .addSelect('infringement.status', 'infringementStatus')
            .groupBy('vehicle.registration')
            .addGroupBy('nomination.rawRedirectionIdentifier')
            .addGroupBy('infringement.status')
            .orderBy('"infringementStatus"', 'DESC')
            .getRawMany();
        this.logger.debug({
            message: `Found ${vehicleIdentifierCombinations.length} (REDIRECTED) vehicles to sync in Jerusalem`,
            fn: this.syncRedirections.name,
        });

        await this.syncVehicleCombinations(vehicleIdentifierCombinations);
    }

    private async syncStandard() {
        // Query to get all vehicles which have at least one infringement in Jerusalem
        const vehicleIdentifierCombinations = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.infringements', 'infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Jerusalem,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .andWhere('infringement.brn is not null')
            .select('vehicle.registration', 'registration')
            .addSelect('infringement.brn', 'identifier')
            .addSelect('infringement.status', 'infringementStatus')
            .groupBy('vehicle.registration')
            .addGroupBy('infringement.brn')
            .addGroupBy('infringement.status')
            .orderBy('"infringementStatus"', 'DESC')
            .getRawMany();
        this.logger.debug({
            message: `Found ${vehicleIdentifierCombinations.length} (STANDARD) vehicles to sync in Jerusalem`,
            fn: this.syncStandard.name,
        });

        await this.syncVehicleCombinations(vehicleIdentifierCombinations);
    }

    private async syncVehicleCombinations(vehicleIdentifierCombinations: any[]) {
        let processed = 0;
        while (processed < vehicleIdentifierCombinations.length) {
            const endOfChunkIndex = processed + Config.get.systemPerformance.queryChunkSize;

            const chunk = vehicleIdentifierCombinations.slice(processed, endOfChunkIndex);

            for (const dto of chunk) {
                try {
                    await this.jerusalemSyncJob.dispatchJob(dto);
                } catch (error) {
                    this.logger.error({
                        message: `Failed to dispatch Jerusalem crawler sync job`,
                        fn: this.sync.name,
                        detail: {
                            dto,
                            error,
                        },
                    });
                }
            }

            processed = endOfChunkIndex;
        }
    }
}
