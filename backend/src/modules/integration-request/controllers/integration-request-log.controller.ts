import { IntegrationRequestLog } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('integration-request-log')
@UseGuards(UserAuthGuard)
export class IntegrationRequestLogController {
    @Get(':logId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getIntegrationRequestLog(@Param('logId') logId): Promise<IntegrationRequestLog> {
        return await IntegrationRequestLog.findOne(logId);
    }
}
