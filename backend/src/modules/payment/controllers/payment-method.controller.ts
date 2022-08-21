import { Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { CreditGuardTokenService } from '@modules/payment/services/credit-guard-token.service';
import { Logger } from '@logger';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { Config } from '@config/config';
import { CreditGuardToken } from '@entities';
import { RpCreditGuardIntegration } from '@integrations/credit-guard/rp-credit-guard.integration';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { CreditGuardTokenDetails } from '@modules/payment/dtos/credit-guard-token.details';
import { CreditGuardFailureParamsDto } from '@modules/payment/dtos/credit-guard-failure-params.dto';

@Controller('payment-method')
export class PaymentMethodController {
    constructor(private paymentMethodService: CreditGuardTokenService, private logger: Logger) {}

    // This route is contacted by redirect from the payment provider, TODO: whitelist URL's
    @Get('update/:accountId/success')
    @ApiOperation({ summary: 'Update account payment details success' })
    async updateAccountPaymentMethodSuccess(
        @Param('accountId') accountId: number,
        @Query() query: CreditGuardTokenDetails,
        @Res() res: Response,
        @Query() fullQuery: any,
    ) {
        try {
            const account = await this.paymentMethodService.saveCreditGuardToken(accountId, query);
            // Successfully stored the details, redirect the browser back to the frontend
            res.redirect(`${Config.get.app.url}/home/account/profile?update-payment-success=true`);
        } catch (e) {
            // Something went wrong,let the frontend know
            this.logger.error({
                message: 'Payment method addition request failed on our side',
                fn: this.updateAccountPaymentMethodSuccess.name,
            });
            res.redirect(`${Config.get.app.url}/home/account/profile?update-payment-success=false`);
        }
    }

    // This route is contacted by redirect from the payment provider
    @Get('update/:accountId/failure')
    @ApiOperation({ summary: 'Update account payment details failure' })
    async updateAccountPaymentMethodFailure(
        @Param('accountId') accountId: number,
        @Query() query: CreditGuardFailureParamsDto,
        @Res() res: Response,
    ) {
        this.logger.error({
            message: 'Payment method addition request failed from integration side',
            detail: query,
            fn: this.updateAccountPaymentMethodFailure.name,
        });
        const url = `${Config.get.app.url}/home/account/profile?update-payment-success=false&error-text=${query.errorText}`;
        this.logger.debug({
            message: 'Redirecting the user to the frontend',
            detail: url,
            fn: this.updateAccountPaymentMethodFailure.name,
        });
        res.redirect(url);
    }

    @Post('charge-token/:tokenId/:cvv/:amount')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    async chargeTokenTest(@Param() params) {
        const token = await CreditGuardToken.findOne(params.tokenId);
        const integration = new RpCreditGuardIntegration();
        return integration.chargeToken(token, params.amount, '123-test', params.cvv);
    }
}
