import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger } from '@logger';
import { Infringement, InfringementLog, InfringementStatus, IturanLocationRecord, Log, LogPriority, LogType } from '@entities';
import { isEmpty } from 'lodash';
import { IturanIntegration } from '@integrations/ituran/ituran-integration';
import { SyncVehicleLocationDto } from '@modules/infringement/controllers/sync-vehicle-location.dto';
import { XlsxService } from '../../shared/modules/spreadsheet/services/xlsx.service';
import { FixOutstandingInfringementService } from '@modules/infringement/services/fix-outstanding-infringement.service';

@Injectable()
export class InfringementScheduleService {
    constructor(
        private logger: Logger,
        private ituranIntegration: IturanIntegration,
        protected createDataSpreadsheetService: XlsxService,
        private fixOutstandingInfringementService: FixOutstandingInfringementService,
    ) {}

    @Cron('*/5 * * * * ') // every 5 minutes
    async updateInfringementStatus() {
        const outstanding = await Infringement.findOutstanding().getMany();

        if (isEmpty(outstanding)) {
            return;
        }

        this.logger.debug({
            message: `InfringementScheduler: found ${outstanding.length} outstanding infringement(s)`,
            detail: null,
            fn: this.updateInfringementStatus.name,
        });

        for (const outstandingInfringement of outstanding) {
            this.logger.log({
                message: `InfringementScheduler: setting infringement ${outstandingInfringement.noticeNumber} to Outstanding`,
                detail: null,
                fn: this.updateInfringementStatus.name,
            });

            outstandingInfringement.status = InfringementStatus.Outstanding;

            await InfringementLog.createAndSave({
                oldStatus: InfringementStatus.Due,
                newStatus: InfringementStatus.Outstanding,
                data: outstandingInfringement,
                infringement: outstandingInfringement,
            });

            await outstandingInfringement.save();
            await Log.createAndSave({
                infringement: outstandingInfringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: 'Set status to Outstanding (automatic)',
            });

            this.logger.log({
                message: `InfringementScheduler: set infringement ${outstandingInfringement.noticeNumber} to Outstanding`,
                detail: null,
                fn: this.updateInfringementStatus.name,
            });
        }
    }

    @Cron('*/5 * * * * ') // every 5 minutes
    async fixInvalidOutstandingStatuses() {
        await this.fixOutstandingInfringementService.fix();
    }

    // @Cron('*/10 * * * * ')
    async syncInfringementVehicleLocation(dto: SyncVehicleLocationDto) {
        try {
            // FIXME: typing
            const records: any = await this.ituranIntegration.getVehicleLocationRecords(
                dto.accountId,
                dto.registration,
                dto.startDate,
                dto.endDate,
            );
            const locationRecords = [];
            for (const record of records.fullreport.records.recordwithplate) {
                const location = { address: record.address, lon: record.lon, lat: record.lat, date: record.date };
                await IturanLocationRecord.createAndSave(location);
                locationRecords.push(location);
            }
            this.logger.debug({
                message: 'Finished updating ituran vehicle location records',
                fn: this.syncInfringementVehicleLocation.name,
            });
            return locationRecords;
        } catch (e) {
            this.logger.error({
                message: 'Error on updating ituran vehicle location records',
                detail: e,
                fn: this.syncInfringementVehicleLocation.name,
            });
        }
    }
}
