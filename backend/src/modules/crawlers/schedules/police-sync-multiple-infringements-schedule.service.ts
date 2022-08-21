import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { Account, Infringement } from '@entities';
import { Logger } from '@logger';
import { PoliceSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/police-sync-multiple-infringements.job';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PoliceSyncMultipleInfringementsScheduleService {
    constructor(private logger: Logger, private policeSyncJob: PoliceSyncMultipleInfringementsJob) {}

    //@Cron('0 5 * * *', { name: 'police_crawler_sync' })
    async sync() {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `Police scheduled sync not enabled`,
                fn: this.sync.name,
            });
            return;
        }
        this.logger.debug({
            message: `Running Police crawler sync`,
            fn: this.sync.name,
        });

        try {
            await this.syncRedirections();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the redirection sync on Police ${e.message}`,
            });
        }

        try {
            await this.syncStandard();
        } catch (e) {
            this.logger.error({
                fn: this.sync.name,
                message: `Failed to run the standard sync on Police ${e.message}`,
            });
        }
    }

    private async syncRedirections() {
        // Query to get all vehicles which have at least one infringement in Police
        const identifiers = await Infringement.createQueryBuilder('infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Police,
            })
            .innerJoin('infringement.nomination', 'nomination')
            .andWhere('infringement.caseNumber is not null')
            .andWhere('nomination.rawRedirectionIdentifier is not null')
            .select('nomination.rawRedirectionIdentifier', 'identifier')
            .groupBy('nomination.rawRedirectionIdentifier')
            .getRawMany();

        this.logger.debug({
            message: `Found ${identifiers.length} (REDIRECTED) identifiers to sync with Police`,
            fn: this.syncStandard.name,
        });
        await this.syncIdentifiers(identifiers);
    }

    private async syncStandard() {
        // Query to get all vehicles which have at least one infringement in Police
        const identifiers = await Infringement.createQueryBuilder('infringement')
            .innerJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Police,
            })
            .andWhere('infringement.caseNumber is not null')
            .andWhere('infringement.brn is not null')
            .select('infringement.brn', 'identifier')
            .groupBy('infringement.brn')
            .getRawMany();

        this.logger.debug({
            message: `Found ${identifiers.length} (STANDARD) identifiers to sync with Police`,
            fn: this.syncStandard.name,
        });
        await this.syncIdentifiers(identifiers);
    }

    private async syncIdentifiers(identifiers: any[]) {
        let processed = 0;
        while (processed < identifiers.length) {
            const endOfChunkIndex = processed + Config.get.systemPerformance.queryChunkSize;

            const chunk = identifiers.slice(processed, endOfChunkIndex);

            for (const dto of chunk) {
                try {
                    await this.policeSyncJob.dispatchJob(dto);
                } catch (error) {
                    this.logger.error({
                        message: `Failed to dispatch Police crawler sync job`,
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
