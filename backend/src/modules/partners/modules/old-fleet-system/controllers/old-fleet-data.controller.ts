import { Logger } from '@logger';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { VerifyBatchInfringementsDto } from '@modules/infringement/dtos/verify-batch-infringements.dto';
import {
    OldFleetFineFilters,
    OldFleetSystemInfringementDataService,
} from '@modules/partners/modules/old-fleet-system/services/old-fleet-system-infringement-data.service';
import { OldIsraelFleetRawInfringementValidityChecker } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement-validity-checker';
import { OldIsraelFleetRawInfringementDto } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement.mapper';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('old-fleet-system')
@UseGuards(UserAuthGuard)
export class OldFleetDataController {
    constructor(private oldFleetSystemInfringementDataService: OldFleetSystemInfringementDataService) {}

    @Post('sync/infringement/all')
    @UseGuards(SystemAdminGuard)
    async syncAllFines(@Body() dto: OldFleetFineFilters) {
        return this.oldFleetSystemInfringementDataService.syncFilteredFines(dto);
    }

    @Post('sync/infringement/:id')
    async syncInfringementById(@Param('id') id: number) {
        return this.oldFleetSystemInfringementDataService.syncInfringementById(id);
    }

    @Post('verify/infringements')
    async verifyInfringementById(@Body() body: VerifyBatchInfringementsDto) {
        return this.oldFleetSystemInfringementDataService.verifyBatchInfringements(body.infringementIds);
    }

    @Get('login')
    async login() {
        return this.oldFleetSystemInfringementDataService.loginToOldIsraelFleet();
    }

    @Post('is-valid')
    async validity(@Body() body: any) {
        // I don't want to do validation on the body because I want to allow any
        // raw data to come in.
        const checker = new OldIsraelFleetRawInfringementValidityChecker(Logger.instance);
        return checker.isValid(body as OldIsraelFleetRawInfringementDto);
    }
}
