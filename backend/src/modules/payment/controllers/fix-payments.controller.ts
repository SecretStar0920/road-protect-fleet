import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { FixPaymentReferencesService } from '@modules/payment/services/fix-payment-references.service';
import { FixExternalPaymentsService } from '@modules/payment/services/fix-external-payments.service';

@Controller('payment/fix')
export class FixPaymentsController {
    constructor(
        private fixPaymentReferencesService: FixPaymentReferencesService,
        private fixExternalPaymentsService: FixExternalPaymentsService,
    ) {}

    @Get('references')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    async fixPaymentReferences() {
        return this.fixPaymentReferencesService.fix();
    }

    @Get('external')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    async addExternalPayments() {
        return this.fixExternalPaymentsService.fix();
    }
}
