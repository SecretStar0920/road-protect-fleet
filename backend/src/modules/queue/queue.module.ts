import { JobModule } from '@modules/job/job.module';
import { Module } from '@nestjs/common';
import { QueueService } from './services/queue.service';
import { QueueController } from '@modules/queue/controllers/queue.controller';
import { QueueScheduleService } from '@modules/queue/services/queue-schedule.service';

/**
 * Module authored by Kerren Ortlepp
 */
@Module({
    imports: [JobModule],
    providers: [QueueService, QueueScheduleService],
    exports: [QueueService],
    controllers: [QueueController],
})
export class QueueModule {}
