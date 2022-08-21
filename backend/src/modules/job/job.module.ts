import { JobQueryController } from '@modules/job/controllers/job-query.controller';
import { JobController } from '@modules/job/controllers/job.controller';
import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';

@Module({
    controllers: [JobQueryController, JobController],
    providers: [JobService],
    exports: [JobService],
})
export class JobModule {}
