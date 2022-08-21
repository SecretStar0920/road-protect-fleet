import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetRequestInformationLogService } from '@modules/request-information-log/services/get-request-information-log.service';
import { CreateRequestInformationLogService } from '@modules/request-information-log/services/create-request-information-log.service';
import { Account, Issuer, RequestInformationLog, RequestInformationLogDetails } from '@entities';
import { IsDefined, IsOptional } from 'class-validator';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { RequestInformationFromIssuerService } from '@modules/request-information-log/services/request-information-from-issuer.service';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { UpdateRequestInformationLogService } from '@modules/request-information-log/services/update-request-information-log.service';

export class UpdateRequestInformationLogDto {
    @IsOptional()
    @FixDate()
    requestSendDate?: string;

    @IsOptional()
    senderAccount: Account;

    @IsOptional()
    issuer: Issuer;

    @IsOptional()
    details: RequestInformationLogDetails;

    @IsOptional()
    responseReceived?: boolean;

    @IsOptional()
    @FixDate()
    responseReceivedDate?: string;
}

export class CreateRequestInformationLogDto {
    @IsDefined()
    @FixDate()
    requestSendDate?: string;

    @IsDefined()
    senderAccount: Account;

    @IsDefined()
    issuer: Issuer;

    @IsOptional()
    details: RequestInformationLogDetails;

    @IsOptional()
    responseReceived?: boolean;

    @IsOptional()
    @FixDate()
    responseReceivedDate?: string;
}

@Controller('request-information-log')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class RequestInformationLogController {
    constructor(
        private getRequestInformationLogService: GetRequestInformationLogService,
        // private getRequestInformationLogsService: GetRequestInformationLogsService,
        private createRequestInformationLogService: CreateRequestInformationLogService,
        private updateRequestInformationLogService: UpdateRequestInformationLogService,
        private requestInformationFromIssuerService: RequestInformationFromIssuerService,
    ) {}

    @Get(':requestInformationLogId')
    async getRequestInformationLog(@Param('requestInformationLogId') requestInformationLogId: number): Promise<RequestInformationLog> {
        return this.getRequestInformationLogService.getRequestInformationLog(requestInformationLogId);
    }

    @Post('send-request')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async requestInformation(@Body() body: { issuerIds: number[] }, @Identity() identity: IdentityDto) {
        return this.requestInformationFromIssuerService.sendRequestEmail(body.issuerIds, identity.accountId);
    }

    @Post(':requestInformationLogId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async updateRequestInformationLog(
        @Param('requestInformationLogId') requestInformationLogId: number,
        @Body() dto: UpdateRequestInformationLogDto,
    ): Promise<RequestInformationLog> {
        return this.updateRequestInformationLogService.updateRequestInformationLog(requestInformationLogId, dto);
    }
}
