import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RedirectMissingInfringementsDto } from '@modules/infringement/controllers/redirect-missing-infringements.dto';
import { ManualInfringementRedirectionService } from '@modules/infringement/services/manual-infringement-redirection.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';

@Controller('infringement/manual-redirection')
export class ManualInfringementRedirectionController {
    constructor(private manualInfringementRedirectionService: ManualInfringementRedirectionService) {}

    @Post('missing')
    @Get('duplicates')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async redirectMissingInfringements(@Body() body: RedirectMissingInfringementsDto) {
        return this.manualInfringementRedirectionService.redirectMissingInfringements(body);
    }
}
