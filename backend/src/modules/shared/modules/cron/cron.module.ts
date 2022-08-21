import { Module } from '@nestjs/common';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { Config } from '@config/config';
import { Logger } from '@logger';

@Module({
    imports: [ScheduleModule.forRoot()],
    exports: [ScheduleModule],
})
export class CronModule {
    constructor(private schedulerRegistry: SchedulerRegistry) {
        setTimeout(() => {
            if (!Config.get.cron.enabled) {
                Logger.instance.log({
                    fn: `CronModule.constructor`,
                    message: `CRONs are DISABLED on this instance`,
                });
                const jobs = schedulerRegistry.getCronJobs();
                jobs.forEach((job) => {
                    job.stop();
                });
                Logger.instance.log({
                    fn: `CronModule.constructor`,
                    message: `Disabled ${jobs.size} jobs`,
                });
            } else {
                Logger.instance.log({
                    fn: `CronModule.constructor`,
                    message: `CRONs are ENABLED on this instance`,
                });
            }
        }, Config.get.cron.initialSleep);
    }
}
