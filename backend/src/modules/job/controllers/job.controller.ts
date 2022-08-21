import { Job } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('job')
@UseGuards(UserAuthGuard)
export class JobController {
    @Get(':uuid')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getIntegrationRequestLog(@Param('uuid') uuid): Promise<Job> {
        return await Job.findOne({ uuid });
    }
}
