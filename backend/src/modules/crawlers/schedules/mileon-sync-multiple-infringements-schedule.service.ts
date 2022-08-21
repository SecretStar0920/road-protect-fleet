import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { InfringementStatus, Vehicle } from '@entities';
import { Logger } from '@logger';
import { MileonSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/mileon-sync-multiple-infringements.job';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MileonSyncMultipleInfringementsScheduleService {
    constructor(private logger: Logger, private mileonSyncJob: MileonSyncMultipleInfringementsJob) {}

    //@Cron('0 5 * * *', { name: 'mileon_crawler_sync' })
    async sync() {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `Mileon scheduled sync not enabled`,
                fn: this.sync.name,
            });
            return;
        }
        this.logger.debug({
            message: `Running Mileon crawler sync`,
            fn: this.sync.name,
        });

        try {
            await this.syncStandard();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the standard sync on Mileon ${e.message}`,
            });
        }
    }

    private async syncStandard() {
        // Query to get all vehicles which have at least one infringement in Mileon
        const vehicleIdentifierCombinations = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.infringements', 'infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Mileon,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .select('vehicle.registration', 'registration')
            .addSelect('issuer.name', 'issuerIdentifier')
            .addSelect('infringement.status', 'infringementStatus')
            .groupBy('registration')
            .addGroupBy('issuer.name')
            .addGroupBy('infringement.status')
            .orderBy('"infringementStatus"', 'DESC')
            .getRawMany();

        this.logger.debug({
            message: `Found ${vehicleIdentifierCombinations.length} (STANDARD) vehicles to sync in Mileon`,
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
                    await this.mileonSyncJob.dispatchJob(dto);
                } catch (error) {
                    this.logger.error({
                        message: `Failed to dispatch Mileon crawler sync job`,
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
