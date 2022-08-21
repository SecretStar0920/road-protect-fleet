import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Logger } from '@logger';
import { FixInvalidStatusTransitionsService } from '@modules/infringement/services/fix-invalid-status-transitions.service';

@Controller('infringement/fix/invalid-status-transitions')
export class FixInvalidStatusTransitionsController {
    constructor(private logger: Logger, private fixInvalidStatusTransitionsService: FixInvalidStatusTransitionsService) {}

    @Get()
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    async fix(@Query('from') from?: string) {
        this.logger.log({
            fn: this.fix.name,
            message: `Running the infringement fix`,
        });
        return this.fixInvalidStatusTransitionsService.fix(from);
    }
}
