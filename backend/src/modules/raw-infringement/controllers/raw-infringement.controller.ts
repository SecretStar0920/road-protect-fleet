import { RawInfringement } from '@entities';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('raw-infringement')
@UseGuards(UserAuthGuard)
export class RawInfringementController {
    @Get(':rawInfringementId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getRawInfringement(@Param('rawInfringementId') rawInfringementId: number): Promise<RawInfringement> {
        return await RawInfringement.findOne(rawInfringementId);
    }
}
