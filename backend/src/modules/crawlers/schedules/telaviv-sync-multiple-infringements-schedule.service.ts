import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { Infringement, InfringementStatus } from '@entities';
import { Logger } from '@logger';
import { TelavivSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/telaviv-sync-multiple-infringements.job';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TelavivSyncMultipleInfringementsScheduleService {
    constructor(private logger: Logger, private telavivSyncJob: TelavivSyncMultipleInfringementsJob) {}

    // TODO: Correct the time interval here
    //@Cron('0 5 * * *', { name: 'telaviv_crawler_sync' })
    async sync() {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `Telaviv scheduled sync not enabled`,
                fn: this.sync.name,
            });
            return;
        }
        this.logger.debug({
            message: `Running Telaviv crawler sync`,
            fn: this.sync.name,
        });

        try {
            await this.syncRedirections();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the redirection sync on Telaviv ${e.message}`,
            });
        }

        try {
            await this.syncStandard();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the standard sync on Telaviv ${e.message}`,
            });
        }
    }

    private async syncRedirections() {
        // Query to get all accounts which have at least one infringement in Telaviv
        const identifiers = await Infringement.createQueryBuilder('infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Telaviv,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .innerJoin('infringement.nomination', 'nomination')
            .andWhere('nomination.rawRedirectionIdentifier is not null')
            .select('nomination.rawRedirectionIdentifier', 'identifier')
            .addSelect('infringement.status', 'infringementStatus')
            .groupBy('nomination.rawRedirectionIdentifier')
            .addGroupBy('infringement.status')
            .orderBy('"infringementStatus"', 'DESC')
            .getRawMany();

        this.logger.debug({
            message: `Found ${identifiers.length} (REDIRECTED) identifiers to sync in Telaviv`,
            fn: this.syncStandard.name,
        });

        await this.syncIdentifiers(identifiers);
    }

    private async syncStandard() {
        // Query to get all accounts which have at least one infringement in Telaviv
        const identifiers = await Infringement.createQueryBuilder('infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Telaviv,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Closed],
            })
            .andWhere('infringement.brn is not null')
            .select('infringement.brn', 'identifier')
            .addSelect('infringement.status', 'infringementStatus')
            .groupBy('infringement.brn')
            .addGroupBy('infringement.status')
            .orderBy('"infringementStatus"', 'DESC')
            .getRawMany();

        this.logger.debug({ message: `Found ${identifiers.length} (STANDARD) identifiers to sync in Telaviv`, fn: this.syncStandard.name });

        await this.syncIdentifiers(identifiers);
    }

    private async syncIdentifiers(identifiers: any[]) {
        let processed = 0;
        while (processed < identifiers.length) {
            const endOfChunkIndex = processed + Config.get.systemPerformance.queryChunkSize;

            const chunk = identifiers.slice(processed, endOfChunkIndex);

            for (const dto of chunk) {
                try {
                    await this.telavivSyncJob.dispatchJob(dto);
                } catch (error) {
                    this.logger.error({
                        message: `Failed to dispatch Telaviv crawler sync`,
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
