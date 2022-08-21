import { Controller, Delete, UseGuards } from '@nestjs/common';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { RateLimitService } from '@modules/rate-limit/rate-limit.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('rate-limit')
export class RateLimitController {
    constructor(private rateLimitService: RateLimitService) {}

    @Delete()
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async clearRateLimits() {
        return await this.rateLimitService.clearLimits();
    }
}
