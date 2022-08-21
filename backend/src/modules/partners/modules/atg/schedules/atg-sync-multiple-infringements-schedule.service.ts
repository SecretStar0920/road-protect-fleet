import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { Account, Infringement, InfringementStatus } from '@entities';
import { Logger } from '@logger';
import { AtgSyncSingleInfringementJob } from '@modules/partners/modules/atg/jobs/atg-sync-single-infringement.job';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AtgSyncMultipleInfringementsScheduleService {
    constructor(private logger: Logger, private atgSyncJob: AtgSyncSingleInfringementJob) {}

    // Every day at 3 AM
    // @Cron('0 3 * * *', { name: 'atg_sync' })
    async sync() {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `ATG scheduled sync not enabled`,
                fn: this.sync.name,
            });
            return;
        }
        this.logger.debug({
            message: `Running ATG sync`,
            fn: this.sync.name,
        });

        // Query to get all Atg infringements
        // TODO: Add scheduler that will verify closed infringements are not actually open
        const infringements = await Infringement.createQueryBuilder('infringement')
            .innerJoin('infringement.vehicle', 'vehicle')
            .innerJoin('infringement.issuer', 'issuer')
            .innerJoin(Account, 'account', 'infringement.brn = account.identifier')
            .innerJoin('account.users', 'users')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.ATG,
            })
            .andWhere('infringement.status not in (:...closedStatuses)', {
                closedStatuses: [InfringementStatus.Paid, InfringementStatus.Closed],
            })
            .andWhere('users.hidden = false')
            .select('vehicle.registration', 'registration')
            .addSelect('infringement.noticeNumber', 'noticeNumber')
            .addSelect('issuer.code', 'issuerCode')
            .groupBy('users."accountId"')
            .addGroupBy('vehicle.registration')
            .addGroupBy('infringement.noticeNumber')
            .addGroupBy('issuer.code')
            .orderBy('count(users."userId")', 'DESC')
            .getRawMany();

        this.logger.debug({ message: `Found ${infringements.length} infringements to sync with ATG`, fn: this.sync.name });

        let processed = 0;
        while (processed < infringements.length) {
            const endOfChunkIndex = processed + Config.get.systemPerformance.queryChunkSize;

            const chunk = infringements.slice(processed, endOfChunkIndex);

            for (const dto of chunk) {
                try {
                    await this.atgSyncJob.dispatchJob(dto);
                } catch (error) {
                    this.logger.error({
                        message: `Failed to dispatch ATG sync job`,
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
