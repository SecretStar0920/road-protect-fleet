import { Controller, Get, UseGuards } from '@nestjs/common';
import { FixInfringementDataService } from '@modules/infringement/services/fix-infringement-data.service';
import { FixDuplicateInfringementsService } from '@modules/infringement/services/fix-duplicate-infringements.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { FixOutstandingInfringementService } from '@modules/infringement/services/fix-outstanding-infringement.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { FixPaymentAmountsService } from '@modules/infringement/services/fix-payment-amounts.service';

@Controller('infringement/fix')
export class FixInfringementController {
    constructor(
        private fixInfringementDataService: FixInfringementDataService,
        private fixDuplicateInfringementsService: FixDuplicateInfringementsService,
        private fixOutstandingInfringementService: FixOutstandingInfringementService,
        private fixPaymentAmountsService: FixPaymentAmountsService,
    ) {}

    @Get('prefix')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixInfringements() {
        return this.fixInfringementDataService.fixInvalidPrefixInfringements();
    }

    @Get('invalid-characters')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixInvalidCharacterInfringements() {
        return this.fixInfringementDataService.fixInvalidCharacterInfringements();
    }

    @Get('duplicates')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixDuplicates() {
        return this.fixDuplicateInfringementsService.fixDuplicates();
    }

    @Get('outstanding')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixOutstanding() {
        return this.fixOutstandingInfringementService.fix();
    }

    @Get('payments')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixPayments() {
        return await this.fixPaymentAmountsService.fix();
    }
}
