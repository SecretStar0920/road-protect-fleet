import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetNominationService } from '@modules/nomination/services/get-nomination.service';
import { GetNominationsService } from '@modules/nomination/services/get-nominations.service';
import { Infringement, Nomination } from '@entities';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { DigitallyRedirectNominationService } from '@modules/nomination/services/digitally-redirect-nomination.service';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcknowledgeNominationService } from '@modules/nomination/services/acknowledge-nomination.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { MunicipallyRedirectNominationService } from '@modules/nomination/services/municipally-redirect-nomination.service';
import { UserSocket } from '@modules/shared/decorators/user-socket.decorator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { UpdateRedirectionService } from '@modules/nomination/services/update-redirection.service';
import { FeatureFlagGuard, FeatureFlagMetadata } from '@modules/shared/modules/feature-flag/guards/feature-flag.guard';
import { MunicipalRedirectionParamDto } from '@modules/nomination/dtos/municipal-redirection-param.dto';
import { BatchMunicipalRedirectionDto } from '@modules/nomination/dtos/batch-municipal-redirection.dto';
import { DigitalRedirectionDto } from '@modules/nomination/dtos/digital-redirection.dto';
import { DigitalRedirectionParamDto } from '@modules/nomination/dtos/digital-redirection-param.dto';
import { UpdateRedirectionStatusDto } from '@modules/nomination/dtos/update-redirection-status.dto';
import { BatchDigitalRedirectionDto } from '@modules/nomination/dtos/batch-digital-redirection.dto';
import { AcknowledgeNominationDto } from '@modules/nomination/dtos/acknowledge-nomination.dto';
import { BatchAcknowledgeNominationDto } from '@modules/nomination/dtos/batch-acknowledge-nomination.dto';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { DigitalNominationHistoricalProcessingService } from '@modules/nomination/services/digital-nomination-historical-processing.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { GenerateMunicipalRedirectionDocumentService } from '@modules/nomination/services/generate-municipal-redirection-document.service';
import { BatchApproveInfringementDto } from '@modules/infringement/dtos/batch-approve-infringement.dto';




@Controller('nomination')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
@ApiTags('Nominations')
export class NominationController {
    constructor(
        private getNominationService: GetNominationService,
        private getNominationsService: GetNominationsService,
        private acknowledgeNominationService: AcknowledgeNominationService,
        private digitallyRedirectNominationService: DigitallyRedirectNominationService,
        private municipallyRedirectNominationService: MunicipallyRedirectNominationService,
        private updateRedirectionService: UpdateRedirectionService,
        private digitalNominationHistoricalProcessingService: DigitalNominationHistoricalProcessingService,
        private generateRedirectionDoumentService: GenerateMunicipalRedirectionDocumentService,
    ) {}

    @Get(':nominationId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringement)
    @ApiOperation({ summary: 'Get Nomination by NominationId' })
    @ApiResponse({ status: 400, description: ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId: 'nominationId' }) })
    async getNomination(@Param('nominationId') nominationId: number): Promise<Nomination> {
        return this.getNominationService.getNomination(nominationId);
    }

    @Get()
    @UseGuards(PermissionGuard, SystemAdminGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getNominations(): Promise<Nomination[]> {
        return this.getNominationsService.getNominations();
    }

    @Get('infringement/:infringementId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getNominationsForInfringement(@Param('infringementId') id: number): Promise<Nomination[]> {
        return this.getNominationsService.getNominationsForInfringement(id);
    }

    @Get('account/:accountId')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.ViewInfringements)
    @ApiExcludeEndpoint()
    async getNominationsForAccount(@Param('accountId') id: number): Promise<Nomination[]> {
        return this.getNominationsService.getNominationsForAccount(id);
    }

    // @Delete(':nominationId')
    // @UseGuards(SystemAdminGuard)
    // @ApiExcludeEndpoint()
    // async deleteNomination(@Param('nominationId') nominationId: number): Promise<Nomination> {
    //     return this.deleteNominationService.deleteNomination(nominationId);
    // }
    //
    // @Delete(':nominationId/soft')
    // @UseGuards(SystemAdminGuard)
    // @ApiExcludeEndpoint()
    // async softDeleteNomination(@Param('nominationId') nominationId: number): Promise<Nomination> {
    //     return this.deleteNominationService.softDeleteNomination(nominationId);
    // }

    @Post('batch/redirect/digital')
    @UseGuards(PermissionGuard, FeatureFlagGuard)
    @Permissions(PERMISSIONS.RedirectInfringement)
    @ApiOperation({ summary: 'Batch digital redirection of nominations' })
    @FeatureFlagMetadata({
        title: 'batch-digital-nomination',
        defaultEnabled: false,
        disabledMessage: 'Digital nominations are not allowed currently',
    })
    async batchDigitallyRedirectNomination(@Body() dto: BatchDigitalRedirectionDto) {
        return this.digitallyRedirectNominationService.batchDigitallyRedirectNomination(dto);
    }

    @Post(':nominationId/redirect/digital')
    @UseGuards(PermissionGuard, FeatureFlagGuard)
    @Permissions(PERMISSIONS.RedirectInfringement)
    @ApiOperation({ summary: 'Digitally redirect of nomination' })
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E021_VehicleNotRelatedToAccount.message({ vehicleId: 'vehicleId', accountId: 'accountId' }) +
            '\n * ' +
            ERROR_CODES.E162_NoAccountOnInfringementForRedirection.message({
                to: 'to',
                infringementId: 'infringementId',
                nominationId: 'nominationId',
            }),
    })
    @FeatureFlagMetadata({
        title: 'automated-digital-nominations',
        defaultEnabled: false,
        disabledMessage: 'Automated digital nominations is not enabled',
    })
    async digitallyRedirectNomination(@Param() params: DigitalRedirectionParamDto, @Body() dto: DigitalRedirectionDto) {
        const statusUpdater = new StatusUpdater();
        const nomination = await this.digitallyRedirectNominationService.digitallyRedirectNomination(
            params.nominationId,
            dto,
            statusUpdater.setSource(StatusUpdateSources.UpdateInfringement),
        );
        await statusUpdater.persist();
        return nomination;
    }

    @Post('batch/redirect/municipal')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.RedirectInfringement)
    @ApiOperation({ summary: 'Batch municipally redirect infringement' })
    async batchMunicipallyRedirectNomination(
        @Body() dto: BatchMunicipalRedirectionDto,
        @Identity() identity: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.municipallyRedirectNominationService.batchMunicipallyRedirectNominations(dto, identity, socket);
    }

    @Post(':nominationId/redirect/municipal')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.RedirectInfringement)
    @ApiOperation({ summary: 'Municipally redirect infringement' })
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId: 'nominationId' }) +
            '\n * ' +
            ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }) +
            '\n * ' +
            ERROR_CODES.E044_CouldNotFindDocument.message({ documentId: 'documentId' }) +
            '\n * ' +
            ERROR_CODES.E082_NominationCannotBeMadeMissingDocuments.message() +
            '\n * ' +
            ERROR_CODES.E084_InfringementNotReadyForRedirection.message() +
            '\n * ' +
            ERROR_CODES.E085_IncorrectNominationStatusForRedirection.message({ nominationStatus: 'nominationStatus' }) +
            '\n * ' +
            ERROR_CODES.E086_RequireLeaseContractForRedirection.message() +
            '\n * ' +
            ERROR_CODES.E087_RequireNominatedAccountForRedirection.message() +
            '\n * ' +
            ERROR_CODES.E088_OnlyRedirectionFromOwnerToUserImplemented.message() +
            '\n * ' +
            ERROR_CODES.E140_DontHaveContactDetailsForUserRunningRequest.message() +
            '\n * ' +
            ERROR_CODES.E164_FailedToMergePdf.message({ error: 'error' }),
    })
    @ApiResponse({
        status: 500,
        description:
            ' * ' +
            ERROR_CODES.E045_FailedToLoadDocument.message() +
            '\n * ' +
            ERROR_CODES.E046_FailedToCreateGeneratedDocument.message() +
            '\n * ' +
            ERROR_CODES.E083_CouldNotRetrieveDocuments.message(),
    })
    async municipallyRedirectNomination(
        @Param() params: MunicipalRedirectionParamDto,
        @Identity() identity: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.municipallyRedirectNominationService.municipallyRedirectNomination(
            params.nominationId,
            identity.accountId,
            identity.user,
            socket,
        );
    }

    @Post(':nominationId/redirect-by-mail/municipal')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.RedirectInfringement)
    @ApiOperation({ summary: 'Municipally redirect infringement by mail' })
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId: 'nominationId' }) +
            '\n * ' +
            ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: 'infringementId' }) +
            '\n * ' +
            ERROR_CODES.E044_CouldNotFindDocument.message({ documentId: 'documentId' }) +
            '\n * ' +
            ERROR_CODES.E082_NominationCannotBeMadeMissingDocuments.message() +
            '\n * ' +
            ERROR_CODES.E084_InfringementNotReadyForRedirection.message() +
            '\n * ' +
            ERROR_CODES.E085_IncorrectNominationStatusForRedirection.message({ nominationStatus: 'nominationStatus' }) +
            '\n * ' +
            ERROR_CODES.E086_RequireLeaseContractForRedirection.message() +
            '\n * ' +
            ERROR_CODES.E087_RequireNominatedAccountForRedirection.message() +
            '\n * ' +
            ERROR_CODES.E088_OnlyRedirectionFromOwnerToUserImplemented.message() +
            '\n * ' +
            ERROR_CODES.E140_DontHaveContactDetailsForUserRunningRequest.message() +
            '\n * ' +
            ERROR_CODES.E164_FailedToMergePdf.message({ error: 'error' }),
    })
    @ApiResponse({
        status: 500,
        description:
            ' * ' +
            ERROR_CODES.E045_FailedToLoadDocument.message() +
            '\n * ' +
            ERROR_CODES.E046_FailedToCreateGeneratedDocument.message() +
            '\n * ' +
            ERROR_CODES.E083_CouldNotRetrieveDocuments.message(),
    })
    async municipallyRedirectNominationByMail(
        @Param() params: MunicipalRedirectionParamDto,
        @Identity() identity: IdentityDto,
        @UserSocket() socket: DistributedWebsocket,
    ) {
        return this.municipallyRedirectNominationService.municipallyRedirectNominationByMail(
            params.nominationId,
            identity.accountId,
            identity.user,
            socket,
        );
    }

    @Post(':nominationId/redirect/approve')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.RedirectInfringement)
    @ApiOperation({ summary: 'Manually update the status of the redirection' })
    @ApiResponse({
        status: 400,
        description:
            ' * ' +
            ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId: 'nominationId' }) +
            '\n * ' +
            ERROR_CODES.E091_NotInRedirectionProcessCannotBeApprovedOrDenied.message(),
    })
    async updateRedirection(
        @Param() params: DigitalRedirectionParamDto,
        @Identity() identity: IdentityDto,
        @Body() dto: UpdateRedirectionStatusDto,
    ) {
        return this.updateRedirectionService.updateRedirectionStatus(params.nominationId, dto);
    }

    @Post('batch/acknowledge')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.AcknowledgeInfringement)
    @ApiExcludeEndpoint()
    async batchAcknowledgeNomination(@Body() dto: BatchAcknowledgeNominationDto) {
        return this.acknowledgeNominationService.batchAcknowledgeNomination(dto);
    }

    @Post(':nominationId/acknowledge')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.AcknowledgeInfringement)
    @ApiExcludeEndpoint()
    async acknowledgeNomination(@Param('nominationId') id: number, @Body() dto: AcknowledgeNominationDto) {
        return this.acknowledgeNominationService.acknowledgeNomination(id, dto);
    }
    @Post(':nominationId/generate-redirection-document')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.GenerateRedirectionDocument)
    @ApiExcludeEndpoint()
    async generateDocumentation(
        @Param('nominationId') id: number,
    ) {
        return this.generateRedirectionDoumentService.generateDocumentationOnly(id);
    }
    
    @Get('digital/process/all')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async digitallyNominateAllInfringements() {
        return this.digitalNominationHistoricalProcessingService.processAllHistoricalInfringements();
    }

    @Get('digital/process/count')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async countInfringementsForDigitalNomination() {
        return this.digitalNominationHistoricalProcessingService.count();
    }

    @Get('digital/process/missing-contracts')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async processNominationsMissingContracts() {
        return this.digitalNominationHistoricalProcessingService.clearNominationsWhereContractIsMissing();
    }

    @Get('digital/process/missing-contracts/count')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async countNominationsMissingContracts() {
        return this.digitalNominationHistoricalProcessingService.countNominationsWhereContractIsMissing();
    }

    @Get('digital/process/:infringementId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async digitallyNominateSingleInfringements(@Param('infringementId') infringementId: number) {
        return this.digitalNominationHistoricalProcessingService.processSingleHistoricalInfringement(infringementId);
    }
}
