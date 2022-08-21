import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { CreditGuardTokenService } from '@modules/payment/services/credit-guard-token.service';
import { Logger } from '@logger';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { GetMunicipalPaymentDetailsService, PayInfringementDetails } from '@modules/payment/services/get-municipal-payment-details.service';
import { MunicipallyPayNominationService } from '@modules/payment/services/municipally-pay-nomination.service';
import { ManualPayNominationService } from '@modules/payment/services/manual-pay-nomination.service';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { FeatureFlagGuard, FeatureFlagMetadata } from '@modules/shared/modules/feature-flag/guards/feature-flag.guard';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { Payment } from '@entities';
import { TokenisationParamsDto } from '@modules/payment/dtos/tokenisation-params.dto';
import { BatchNominationPaymentDetailsDto } from '@modules/payment/dtos/batch-nomination-payment-details.dto';
import { ManualPayNominationDto } from '@modules/payment/dtos/manual-pay-nomination.dto';
import { BatchMunicipalPayNominationsDto } from '@modules/payment/dtos/batch-municipal-pay-nominations.dto';
import { MunicipallyPayNominationDto } from '@modules/payment/dtos/municipally-pay-nomination.dto';
import { EncryptionHelper } from '@modules/shared/helpers/encryption.helper';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Controller('payment')
@UseGuards(UserAuthGuard, FeatureFlagGuard)
export class PaymentController {
    constructor(
        private paymentMethodService: CreditGuardTokenService,
        private logger: Logger,
        private getMunicipalPaymentDetailsService: GetMunicipalPaymentDetailsService,
        private municipallyPayNominationService: MunicipallyPayNominationService,
        private manualPayNominationService: ManualPayNominationService,
    ) {}

    @Get('tokenisation-url/:accountId/:type')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditProfile)
    @ApiOperation({ summary: 'Update account payment method' })
    @ApiExcludeEndpoint()
    @FeatureFlagMetadata({ title: 'payment-method-tokenisation', defaultEnabled: true })
    async requestTokenisationUrl(@Param() params: TokenisationParamsDto) {
        const url = await this.paymentMethodService.generateTokenisationUrl(params.type, params.accountId);
        return { url };
    }

    @Post('nomination/batch/details')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getPaymentDetailsBatchGrouped(@Body() dto: BatchNominationPaymentDetailsDto, @Identity() identity: IdentityDto) {
        return this.getMunicipalPaymentDetailsService.getPaymentDetailsBatchGrouped(dto.nominationIds, identity.accountId);
    }

    @Get('nomination/:nominationId/details')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getNominationPaymentDetail(
        @Param('nominationId') nominationId: number,
        @Identity() identity: IdentityDto,
    ): Promise<PayInfringementDetails> {
        return this.getMunicipalPaymentDetailsService.getPaymentDetails(nominationId, identity.accountId);
    }

    @Post('nomination/:nominationId/manual')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ManualPayInfringement)
    @ApiOperation({ summary: 'Upload proof of manual payment for nomination' })
    async manualPayNomination(@Param('nominationId') nominationId: number, @Body() dto: ManualPayNominationDto) {
        return this.manualPayNominationService.manualPayNomination(nominationId, dto);
    }

    @Post('nomination/batch/municipal')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.PayInfringement)
    @ApiOperation({ summary: 'Batch Municipal payment for nomination' })
    @FeatureFlagMetadata({ title: 'batch-pay-nomination', defaultEnabled: true })
    async batchMunicipalPayNomination(
        @Body() dto: BatchMunicipalPayNominationsDto,
        @Identity() identity: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.municipallyPayNominationService.batchMunicipalPayNomination(dto.nominationIds, identity.accountId, dto.cvv, socket);
    }

    @Post('nomination/:nominationId/municipal')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.PayInfringement)
    @ApiOperation({ summary: 'Municipal payment for nomination' })
    @FeatureFlagMetadata({ title: 'pay-nomination', defaultEnabled: true })
    async municipalPayNomination(
        @Param('nominationId') nominationId: number,
        @Identity() identity: IdentityDto,
        @Body() dto: MunicipallyPayNominationDto,
    ) {
        return this.municipallyPayNominationService.municipallyPayNomination(nominationId, identity.accountId, dto.cvv);
    }

    // @Post('atg/verification/:infringementId')
    // @UseGuards(SystemAdminGuard)
    // async atgVerifyInfringement(@Param('infringementId') id: number) {
    //     const infringement = await Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();
    //     if (!infringement) {
    //         throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: id }) });
    //     }
    //     const integration = new AutomationPaymentIntegration(this.logger);
    //     return integration.verifyInfringement(infringement);
    // }

    @Get(':paymentId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    // TODO: Remove this when we're done with payment debugging
    async getPayment(@Param('paymentId') paymentId: number) {
        return Payment.find({
            where: {
                paymentId,
            },
        });
    }

    @Post('decrypt')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    // TODO: Remove this when we're done with payment debugging
    async decrypt(@Body() body: any) {
        return EncryptionHelper.decryptJSON(body);
    }
}
