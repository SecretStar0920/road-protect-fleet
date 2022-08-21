import { Logger } from '@logger';
import { Body, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { LinkingService } from '@modules/shared/services/linking.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Infringement } from '@entities';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';

export class ResetInfringementLinksDto {
    @IsNumber({}, { each: true })
    infringementIds: number[];
}

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly linkingService: LinkingService,
        private readonly logger: Logger,
    ) {}

    @Get('health')
    async health(): Promise<any> {
        return this.appService.checkHealth();
    }

    @Get('health/network')
    async networkCheck(@Req() req): Promise<any> {
        return {
            success: true,
            clientIp: req.clientIp,
            headers: req.headers,
        };
    }

    // TODO: Remove this from app controller
    @Post('relink-all')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async resetLinks(): Promise<boolean> {
        // DANGEROUS DO NOT USE WITHOUT BEING SURE
        try {
            const result = await this.linkingService.relinkAll();
            return true;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    @Post('re-link/infringements')
    @UseGuards(UserAuthGuard, SystemAdminGuard)
    @ApiExcludeEndpoint()
    async resetInfringementLinks(@Body() dto: ResetInfringementLinksDto): Promise<any> {
        const failed = [];
        const successful = [];
        const infringements = await Infringement.findWithMinimalRelations()
            .where('infringement.infringementId IN (:...ids)', { ids: dto.infringementIds })
            .getMany();
        for (const infringement of infringements) {
            try {
                const statusUpdater = StatusUpdater.create()
                    .setFinalInfringement(infringement)
                    .setInitialNomination(infringement.nomination)
                    .setSource(StatusUpdateSources.ContractUpdate);
                await this.linkingService.linkInfringementContractAndResolveNomination(infringement, statusUpdater);
                successful.push(infringement.infringementId);
            } catch (e) {
                this.logger.error({ message: 'Failed to link provided infringements', fn: this.resetInfringementLinks.name, detail: e });
                failed.push({ [infringement.infringementId]: e });
            }
        }
        return {
            successful,
            failed,
        };
    }
}
