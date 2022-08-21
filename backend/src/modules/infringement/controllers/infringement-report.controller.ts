import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
    InfringementReportingByAccountRelationService,
    IInfringementReportOutcome,
} from '@modules/infringement/services/infringement-reporting-by-account-relation.service';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
    AccountInfringementReportDto,
    AccountRelationInfringementReportDto,
} from '@modules/infringement/controllers/infringement-report.dto';
import { PermissionGuard, Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { InfringementReportingByAccountService } from '@modules/infringement/services/infringement-reporting-by-account.service';

@Controller('infringement-report')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class InfringementReportController {
    constructor(
        private infringementReportingByAccountRelationService: InfringementReportingByAccountRelationService,
        private infringementReportingByAccountService: InfringementReportingByAccountService,
    ) {}

    @Post('account')
    @UseGuards(SystemAdminGuard)
    async sendAccountInfringementReport(@Body() dto: AccountInfringementReportDto): Promise<IInfringementReportOutcome> {
        return this.infringementReportingByAccountService.sendOneAccountInfringementReportByAccountId(dto);
    }

    @Post('bulk-account-relation')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.InfringementReporting)
    async sendBulkAccountRelationsInfringementReports() {
        return this.infringementReportingByAccountRelationService.sendBulkAccountRelationsInfringementReports();
    }

    @Post('account-relation')
    @UseGuards(PermissionGuard)
    @Permissions(PERMISSIONS.InfringementReporting)
    async sendAccountRelationInfringementReport(@Body() dto: AccountRelationInfringementReportDto): Promise<IInfringementReportOutcome> {
        return this.infringementReportingByAccountRelationService.sendOneAccountRelationInfringementReportByAccountRelationId(dto);
    }
}
