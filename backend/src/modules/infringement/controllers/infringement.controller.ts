import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetInfringementService } from '@modules/infringement/services/get-infringement.service';
import { GetInfringementsService } from '@modules/infringement/services/get-infringements.service';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { DeleteInfringementService } from '@modules/infringement/services/delete-infringement.service';
import { Infringement, InfringementCreationMethod } from '@entities';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { GetRedirectionDetailsService } from '@modules/nomination/services/get-redirection-details.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InfringementScheduleService } from '@modules/infringement/services/infringement-schedule.service';
import { SyncVehicleLocationDto } from '@modules/infringement/controllers/sync-vehicle-location.dto';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { BatchMunicipalRedirectionDetails } from '@modules/nomination/dtos/batch-municipal-redirection.details';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { GetRedirectionDetailsBatchDto } from '@modules/infringement/controllers/get-redirection-details-batch.dto';
import { GetRedirectionDetailsParamDto } from '@modules/infringement/controllers/get-redirection-details-param.dto';
import { UpsertInfringementService } from '@modules/infringement/services/upsert-infringement.service';
import { UpsertInfringementDto } from '@modules/infringement/controllers/upsert-infringement.dto';
import { ApproveInfringementForPaymentService } from '@modules/infringement/services/approve-infringement-for-payment.service';
import { BatchApproveInfringementDto } from '@modules/infringement/dtos/batch-approve-infringement.dto';
import { UnapproveInfringementForPaymentService } from '@modules/infringement/services/unapprove-infringement-for-payment.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';

@Controller('infringement')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Infringements')
export class InfringementController {
    constructor(
        private getInfringementService: GetInfringementService,
        private getInfringementsService: GetInfringementsService,
        private getRedirectionDetailsService: GetRedirectionDetailsService,
        private createInfringementService: CreateInfringementService,
        private updateInfringementService: UpdateInfringementService,
        private upsertInfringementService: UpsertInfringementService,
        private deleteInfringementService: DeleteInfringementService,
        private infringementScheduleService: InfringementScheduleService,
        private approveInfringementForPaymentService: ApproveInfringementForPaymentService,
        private unapproveInfringementForPaymentService: UnapproveInfringementForPaymentService,
        private upsertInfringementNoteService: UpsertInfringementNoteService,
    ) {}

    @Get()
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getInfringements(): Promise<Infringement[]> {
        return this.getInfringementsService.get();
    }

    @Get(':infringementId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringement)
    @ApiOperation({ summary: 'Get infringement by Infringement Id' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }) })
    async getInfringement(@Param('infringementId') infringementId: number): Promise<Infringement> {
        return this.getInfringementService.getInfringement(infringementId);
    }

    @Get(':infringementId/redirection-readiness')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringement)
    @ApiOperation({ summary: 'Check if infringement has required documentation for municipal redirection' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }) })
    async getRedirectionDetails(@Param() params: GetRedirectionDetailsParamDto): Promise<MunicipalRedirectionDetails> {
        return this.getRedirectionDetailsService.getRedirectionDetails(params.infringementId);
    }

    @Post('batch/redirection-readiness')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringement)
    @ApiOperation({ summary: 'Check if infringements have required documentation for municipal redirection' })
    async getManyRedirectionDetails(@Body() dto: GetRedirectionDetailsBatchDto): Promise<BatchMunicipalRedirectionDetails> {
        return this.getRedirectionDetailsService.getRedirectionDetailsBatch(dto);
    }

    @Get('vehicle/:vehicleId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getInfringementsForVehicle(@Param('vehicleId') vehicleId: number): Promise<Infringement[]> {
        return this.getInfringementsService.getInfringementsForVehicle(vehicleId);
    }

    @Get('issuer/:issuerId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getInfringementsForIssuer(@Param('issuerId') issuerId: number): Promise<Infringement[]> {
        return this.getInfringementsService.getInfringementsForIssuer(issuerId);
    }

    @Get('account/:accountId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getInfringementsForAccount(@Param('accountId') accountId: number): Promise<Infringement[]> {
        return this.getInfringementsService.getInfringementsForAccount(accountId);
    }

    @Get('locations/:accountId/:registration/:startDate/:endDate')
    @ApiExcludeEndpoint()
    async syncInfringementVehicleLocation(@Param() dto: SyncVehicleLocationDto): Promise<any> {
        return this.infringementScheduleService.syncInfringementVehicleLocation(dto);
    }

    @Post('batch/approve')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ApproveInfringement)
    @ApiOperation({ summary: 'Batch infringement approval for payment' })
    async batchApproveInfringementForPayment(@Body() dto: BatchApproveInfringementDto, @Identity() identity: IdentityDto) {
        return this.approveInfringementForPaymentService.batchApproveInfringementForPayment(dto, identity);
    }

    @Post(':infringementId/approve')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ApproveInfringement)
    @ApiOperation({ summary: 'Approve nomination for payment' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }) })
    async approveInfringementForPayment(@Param('infringementId') id: number, @Identity() identity: IdentityDto) {
        return this.approveInfringementForPaymentService.approveInfringementForPayment(id, identity);
    }

    @Post(':infringementId/unapprove')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.UnapproveInfringement)
    @ApiOperation({ summary: 'Unapprove infringement for payment' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }) })
    async unapprovedInfringementForPayment(@Param('infringementId') id: number, @Identity() identity: IdentityDto) {
        return this.unapproveInfringementForPaymentService.unapproveInfringementForPayment(id, identity);
    }

    @Post()
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.CreateInfringement)
    @ApiExcludeEndpoint()
    async createInfringement(@Body() dto: CreateInfringementDto, @Identity() identity: IdentityDto): Promise<Infringement> {
        if (identity.user.type !== 'Admin' && identity.user.type !== 'Developer') {
            dto.tags = undefined
        }

        // It is assumed that a user is creating this infringement
        const infringement = await this.createInfringementService.createInfringement(dto, {}, InfringementCreationMethod.User);
        // Upsert infringement notes - infringement needs to be created and saved before linking a note
        if (dto.note) {
            await this.upsertInfringementNoteService.upsertInfringementNote({ value: dto.note }, null, infringement);
        }
        return infringement;
    }

    @Post('update-status')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async updateInfringementStatus(@Body() dto: UpsertInfringementDto) {
        const canOverrideStatus = true;
        dto.setRedirectionIdentifier = true;
        dto.setRedirectionCompletionDate = true;
        return this.upsertInfringementService.upsertInfringement(dto, canOverrideStatus);
    }

    @Post(':infringementId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.EditInfringements)
    @ApiOperation({ summary: 'Update infringement' })
    @ApiResponse({
        status: 400,
        description:
            ` * Invalid infringement status update. Cannot go from current to next.` +
            '\n * ' +
            ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }),
    })
    @ApiResponse({ status: 500, description: `Database Error` })
    async updateInfringement(
        @Param('infringementId') infringementId: number,
        @Body() dto: UpdateInfringementDto,
        @Identity() identity: IdentityDto
    ): Promise<Infringement> {
        if (identity.user.type !== 'Admin' && identity.user.type !== 'Developer') {
            dto.tags = undefined
        }

        return this.updateInfringementService.updateInfringement(infringementId, dto);
    }

    @Delete(':infringementId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async deleteInfringement(@Param('infringementId') infringementId: number): Promise<Infringement> {
        return this.deleteInfringementService.deleteInfringement(infringementId);
    }

    @Delete(':infringementId/soft')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async softDeleteInfringement(@Param('infringementId') infringementId: number): Promise<Infringement> {
        return this.deleteInfringementService.softDeleteInfringement(infringementId);
    }
}
