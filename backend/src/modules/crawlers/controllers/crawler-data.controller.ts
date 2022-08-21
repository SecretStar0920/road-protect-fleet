import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { JerusalemSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/jerusalem-sync-multiple-infringements-schedule.service';
import { MileonSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/mileon-sync-multiple-infringements-schedule.service';
import { PoliceSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/police-sync-multiple-infringements-schedule.service';
import { TelavivSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/telaviv-sync-multiple-infringements-schedule.service';
import { AtgSyncMultipleInfringementsScheduleService } from '@modules/partners/modules/atg/schedules/atg-sync-multiple-infringements-schedule.service';
import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

enum ScheduledCrawlers {
    Jerusalem = 'jerusalem',
    Telaviv = 'telaviv',
    Mileon = 'mileon',
    Police = 'police',
    ATG = 'atg',
    City4u = 'city4u',
}

@Controller('crawler-data')
@UseGuards(SystemAdminGuard)
@UseGuards(UserAuthGuard)
export class CrawlerDataController {
    constructor(
        private jerusalemSync: JerusalemSyncMultipleInfringementsScheduleService,
        private telavivSync: TelavivSyncMultipleInfringementsScheduleService,
        private mileonSync: MileonSyncMultipleInfringementsScheduleService,
        private policeSync: PoliceSyncMultipleInfringementsScheduleService,
        private atgSync: AtgSyncMultipleInfringementsScheduleService,
    ) {}

    @Get('sync/:crawlerName')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async syncCrawler(@Param('crawlerName') crawlerName: ScheduledCrawlers) {
        switch (crawlerName) {
            case ScheduledCrawlers.Jerusalem:
                await this.jerusalemSync.sync();
                return 'Started Jerusalem sync';
            case ScheduledCrawlers.Mileon:
                await this.mileonSync.sync();
                return 'Started Mileon sync';
            case ScheduledCrawlers.Telaviv:
                await this.telavivSync.sync();
                return 'Started Telaviv sync';
            case ScheduledCrawlers.Police:
                await this.policeSync.sync();
                return 'Started Police sync';
            case ScheduledCrawlers.ATG:
                await this.atgSync.sync();
                return 'Started ATG sync';
            default:
                throw new BadRequestException(ERROR_CODES.E009_ScheduledCrawlerNowFound.message());
        }
    }
}
