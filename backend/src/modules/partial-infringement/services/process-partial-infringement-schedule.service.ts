import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ProcessPartialInfringementService } from '@modules/partial-infringement/services/process-partial-infringement.service';
import { Cron } from '@nestjs/schedule';
import { Config } from '@config/config';

@Injectable()
export class ProcessPartialInfringementScheduleService {
    constructor(private logger: Logger, private processPartialInfringementService: ProcessPartialInfringementService) {}

    // Every 15 minutes
    @Cron('*/15 * * * *', { name: 'partial_infringement_sync' })
    async sync() {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `Partial infringement scheduled sync not enabled`,
                fn: this.sync.name,
            });
            return;
        }
        this.logger.debug({
            message: `Running Partial Infringement sync`,
            fn: this.sync.name,
        });

        // Query to get all partial infringements that are not queued
        const toProcess = await this.processPartialInfringementService.findPendingPartialInfringements();
        this.logger.debug({
            message: `Found ${toProcess.length} partial infringements to sync`,
            fn: this.sync.name,
        });

        let processed = 0;
        while (processed < toProcess.length) {
            const endOfChunkIndex = processed + Config.get.systemPerformance.partialInfringementChunkSize;
            const chunk = toProcess.slice(processed, endOfChunkIndex);
            try {
                return this.processPartialInfringementService.processPartialInfringements(chunk);
            } catch (error) {
                this.logger.error({
                    message: `Failed to dispatch partial infringements sync job`,
                    fn: this.sync.name,
                    detail: {
                        chunk,
                        error,
                    },
                });
            }
            processed = endOfChunkIndex;
        }
    }
}
