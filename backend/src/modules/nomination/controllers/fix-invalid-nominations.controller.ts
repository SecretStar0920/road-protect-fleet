import { Controller, Get, UseGuards } from '@nestjs/common';
import { FixInvalidRedirectionsService } from '@modules/nomination/services/fix-invalid-redirections.service';
import { FixNominationsMissingContractsService } from '@modules/nomination/services/fix-nominations-missing-contracts.service';
import { FixPaymentDatesService } from '@modules/nomination/services/fix-payment-dates.service';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { FixContractualNominationsService } from '@modules/nomination/services/fix-contractual-nominations.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { FixApprovedForPaymentNominationService } from '@modules/nomination/services/fix-approved-for-payment-nomination.service';

@Controller('nomination/fix')
export class FixInvalidNominationsController {
    constructor(
        private fixInvalidNominationsService: FixInvalidRedirectionsService,
        private fixNominationsMissingContractsService: FixNominationsMissingContractsService,
        private fixPaymentDatesService: FixPaymentDatesService,
        private fixContractualNominationsService: FixContractualNominationsService,
        private fixApprovedForPaymentNominationService: FixApprovedForPaymentNominationService,
    ) {}

    @Get('invalid-redirections')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixInvalidRedirections() {
        return this.fixInvalidNominationsService.fixInvalidRedirections();
    }

    @Get('missing-contracts')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixRedirectionsMissingContracts() {
        return this.fixNominationsMissingContractsService.fixMissingContracts();
    }

    @Get('payment-dates')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixPaymentDates() {
        return this.fixPaymentDatesService.fix();
    }

    @Get('contractual-nominations')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixContractualNominations() {
        return this.fixContractualNominationsService.fix();
    }

    @Get('approved-for-payment-nominations')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fixApprovedForPaymentNominations() {
        return this.fixApprovedForPaymentNominationService.fix();
    }
}
