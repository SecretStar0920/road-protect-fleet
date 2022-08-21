import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { QueueService } from '@modules/queue/services/queue.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('queue')
@UseGuards(UserAuthGuard)
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Get('health')
    @ApiExcludeEndpoint()
    async getHealth() {
        return this.queueService.isHealthy();
    }

    @Get('job/stats')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getStats() {
        return this.queueService.getQueueStats();
    }

    @Get('clear/:queueName')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async clearQueue(@Param('queueName') queueName: string) {
        return this.queueService.clearQueue(queueName);
    }

    @Get('clear')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async clearAll() {
        return this.queueService.clearAll();
    }

    @Get('failed/:queueName')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async failedJobs(@Param('queueName') queueName: string) {
        return this.queueService.getFailedJobs(queueName);
    }
}
