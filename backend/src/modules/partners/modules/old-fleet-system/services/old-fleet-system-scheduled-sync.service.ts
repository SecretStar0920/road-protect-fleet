import { Logger } from '@logger';
import { RawInfringement, Vehicle } from '@entities';
import { Cron } from '@nestjs/schedule';
import {
    IOneFineFromOldIsraelFleet,
    OldFleetFineFilters,
    OldFleetSystemInfringementDataService,
} from '@modules/partners/modules/old-fleet-system/services/old-fleet-system-infringement-data.service';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';

@Injectable()
export class OldFleetSystemScheduledSyncService {
    constructor(private logger: Logger, private syncInfringementDataInterfaceService: OldFleetSystemInfringementDataService) {}

    // Sync 4x a day, get fines from last 6.5h for all vehicles in system
    // @Cron('0 0 */6 * * * ')
    async syncInfringementsFromLastSixHours() {
        if (!(await FeatureFlagHelper.isEnabled({ title: 'small-old-fleet-sync', defaultEnabled: false }))) {
            return;
        }

        // const vehicleRegistrations = await this.getAllVehicleRegistrations();

        const sinceVerificationDate = moment().add(`-6.5`, 'hours').toISOString();

        await this.syncInfringementsForSinceVerificationDate(sinceVerificationDate);
    }

    // Sync 1x week, get fines from last week for all vehicles in system
    // Runs every Sunday at 00:00
    // @Cron('0 0 0 * * 0 ')
    async syncInfringementsFromLastWeek() {
        if (!(await FeatureFlagHelper.isEnabled({ title: 'large-old-fleet-sync', defaultEnabled: false }))) {
            return;
        }

        // const vehicleRegistrations = await this.getAllVehicleRegistrations();

        const sinceVerificationDate = moment().add(`-7.5`, 'days').toISOString();

        await this.syncInfringementsForSinceVerificationDate(sinceVerificationDate);
    }

    // Get fines from last (x) period for array of vehicles (registration number)
    async syncInfringementsForArrayOfVehicleRegistrations(vehicleRegistrations: string[], sinceVerificationDate: string) {
        const rawInfringements: { successful: RawInfringement[]; failed: IOneFineFromOldIsraelFleet[] }[] = [];
        for (const vehicleRegistration of vehicleRegistrations) {
            const filter: OldFleetFineFilters = {
                vehicleRegistration,
                sinceVerificationDate,
            };

            const rawInfringement = await this.syncInfringementDataInterfaceService.syncFilteredFines(filter);
            rawInfringements.concat(rawInfringement);
        }
        return rawInfringements;
    }

    // Get fines from last (x) period
    async syncInfringementsForSinceVerificationDate(sinceVerificationDate: string) {
        const rawInfringements: { successful: RawInfringement[]; failed: IOneFineFromOldIsraelFleet[] }[] = [];
        const filter: OldFleetFineFilters = {
            sinceVerificationDate,
        };

        this.logger.debug({
            message: `Running an infringement sync for fines verified after ${sinceVerificationDate}`,
            fn: this.syncInfringementsForSinceVerificationDate.name,
            detail: {
                filter,
            },
        });

        const rawInfringement = await this.syncInfringementDataInterfaceService.syncFilteredFines(filter);
        rawInfringements.concat(rawInfringement);

        this.logger.debug({
            message: `Completed the infringement sync for fines verified after ${sinceVerificationDate}`,
            fn: this.syncInfringementsForSinceVerificationDate.name,
            detail: { rawInfringements },
        });

        return rawInfringements;
    }

    // Get array of all vehicles registration numbers in system
    async getAllVehicleRegistrations(): Promise<string[]> {
        const vehicles = await Vehicle.createQueryBuilder('vehicle').select('vehicle.registration').getMany();
        return vehicles.map((vehicle) => {
            return vehicle.registration;
        });
    }
}
