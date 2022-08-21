import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PartialInfringement } from '@entities';
import { CreatePartialInfringementService } from '@modules/partial-infringement/services/create-partial-infringement.service';
import { DeletePartialInfringementService } from '@modules/partial-infringement/services/delete-partial-infringement.service';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { CreatePartialInfringementDto } from '@modules/partial-infringement/dtos/create-partial-infringement.dto';
import { ProcessPartialInfringementService } from '@modules/partial-infringement/services/process-partial-infringement.service';
import { FetchPartialInfringementsService } from '@modules/partial-infringement/services/fetch-partial-infringements.service';

@Controller('partial-infringement')
@UseGuards(UserAuthGuard)
export class PartialInfringementController {
    constructor(
        private createPartialInfringementService: CreatePartialInfringementService,
        private deletePartialInfringementService: DeletePartialInfringementService,
        private processPartialInfringementService: ProcessPartialInfringementService,
        private fetchPartialInfringementsService: FetchPartialInfringementsService,
    ) {}

    @Get('process')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async processPartialInfringements() {
        return await this.processPartialInfringementService.queueAllPartialInfringements();
    }

    @Get('fetch')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async fetchPartialInfringements() {
        return await this.fetchPartialInfringementsService.fetchPartialInfringements();
    }

    @Get(':partialInfringementId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async getPartialInfringement(@Param('partialInfringementId') partialInfringementId): Promise<PartialInfringement> {
        return await PartialInfringement.findOne(partialInfringementId);
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async createPartialInfringement(@Body() dto: CreatePartialInfringementDto): Promise<PartialInfringement> {
        return this.createPartialInfringementService.createPartialInfringement(dto);
    }

    @Delete(':partialInfringementId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async deletePartialInfringement(@Param('partialInfringementId') partialInfringementId: number): Promise<PartialInfringement> {
        return await this.deletePartialInfringementService.deletePartialInfringement(partialInfringementId);
    }
}
