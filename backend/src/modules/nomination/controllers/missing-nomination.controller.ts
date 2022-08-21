import { Controller, Get, UseGuards } from '@nestjs/common';
import { MissingNominationService } from '@modules/nomination/services/missing-nomination.service';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('nomination/missing')
export class MissingNominationController {
    constructor(private missingNominationService: MissingNominationService) {}

    @Get()
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getInfringementsWithMissingNominations() {
        return this.missingNominationService.findInfringementsWithoutNominations();
    }

    @Get('fix')
    @ApiExcludeEndpoint()
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    async fixInfringementsWithMissingNominations() {
        return this.missingNominationService.addMissingNominations();
    }
}
