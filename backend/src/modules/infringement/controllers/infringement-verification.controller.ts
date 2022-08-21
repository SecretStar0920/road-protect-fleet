import { InfringementVerificationProvider } from '@config/infringement';
import { VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import {
    VerifyBatchInfringementsByNoticeNumberDto,
    VerifyBatchInfringementsDto,
} from '@modules/infringement/dtos/verify-batch-infringements.dto';
import { VerifyUnpaidInfringementScheduleService } from '@modules/infringement/services/verify-unpaid-infringement-schedule.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@Controller('infringement-verification')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Infringements')
export class InfringementVerificationController {
    constructor(
        private verifyInfringementService: VerifyInfringementService,
        private verifyUnpaidInfringementService: VerifyUnpaidInfringementScheduleService,
    ) {}

    @Post('verify')
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    async verifyInfringementByIds(
        @Body() dto: VerifyBatchInfringementsDto,
        @Identity() identityDto: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.verifyInfringementService.verify(dto.infringementIds, identityDto.user?.userId, socket);
    }

    @Post('notice-number')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async synchronousVerifyInfringementByNoticeNumbers(
        @Body() dto: VerifyBatchInfringementsByNoticeNumberDto,
        @Identity() identityDto: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.verifyInfringementService.synchronousVerifyInfringementByNoticeNumbers(
            dto.noticeNumbers,
            identityDto.user?.userId,
            socket,
        );
    }

    @Get('brn/:brn')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async synchronousVerifyInfringementByBrn(
        @Param('brn') brn: number,
        @Identity() identityDto: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.verifyInfringementService.synchronousVerifyInfringementByBrn(String(brn), identityDto.user?.userId, socket);
    }

    @Get('vehicle/:registration')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async synchronousVerifyInfringementByVehicle(
        @Param('registration') registration: number,
        @Identity() identityDto: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.verifyInfringementService.synchronousVerifyInfringementByVehicle(
            String(registration),
            identityDto.user?.userId,
            socket,
        );
    }

    @Post(':infringementId/verify')
    @UseGuards(UserAuthGuard)
    @ApiExcludeEndpoint()
    async verifyInfringementById(@Param('infringementId') infringementId: number, @UserSocket() socket: DistributedWebsocket) {
        return this.verifyInfringementService.synchronousVerification(infringementId, socket);
    }

    @Get('verify/unpaid')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async verifyUnpaid(@Query('provider') provider?: InfringementVerificationProvider) {
        this.verifyUnpaidInfringementService.verifyUnpaid(provider).catch();
        return 'Started verifications manually. Watch logs for more details.';
    }
}
