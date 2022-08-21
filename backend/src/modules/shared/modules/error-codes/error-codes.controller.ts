import { Controller, Post, UseGuards } from '@nestjs/common';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { ErrorCodesService } from '@modules/shared/modules/error-codes/error-codes.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@Controller('error-codes')
@UseGuards(UserAuthGuard)
export class ErrorCodesController {
    constructor(private errorCodesService: ErrorCodesService) {}

    @Post()
    @UseGuards(SystemAdminGuard)
    async generateErrorCodesSpreadsheet() {
        return this.errorCodesService.generateErrorCodesSpreadsheet();
    }
}
