import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Vehicle } from '@entities';
import { Brackets } from 'typeorm';
import * as moment from 'moment';
import { VehicleAutomationIntegration } from '@integrations/automation/vehicle/vehicle.automation-integration';
import { InitialSyncDto } from '../controllers/vehicle.controller';
import { Cron } from '@nestjs/schedule';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';

@Injectable()
export class AtgVehicleSyncService {
    constructor(private logger: Logger, private vehicleIntegration: VehicleAutomationIntegration) {}

    @Cron('0 22 * * * ')
    async syncVehiclesWithAutomation() {
        // Check feature is enabled, otherwise return early
        if (!(await FeatureFlagHelper.isEnabled({ title: 'atg-vehicle-sync' }))) {
            return;
        }

        this.logger.log({ message: 'Syncing Vehicles with ATG', detail: null, fn: this.syncVehiclesWithAutomation.name });
        const newVehicles = await Vehicle.createQueryBuilder('vehicle')
            .select([])
            .addSelect('vehicle.registration', 'vehicleId')
            .addSelect('MIN(contract."startDate")', 'startTime')
            .addSelect('MAX(contract."endDate")', 'endTime')
            .innerJoin('vehicle.contracts', 'contract')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('vehicle.createdAt >= :date', {
                        date: moment().add('-1', 'day').toISOString(),
                    });
                    qb.orWhere('contract.createdAt >= :date', {
                        date: moment().add('-1', 'day').toISOString(),
                    });
                }),
            )
            .groupBy('vehicle.registration')
            .getRawMany();

        const addFails: any[] = [];
        for (const vehicle of newVehicles) {
            try {
                this.logger.debug({ message: 'Adding vehicle', detail: vehicle, fn: this.syncVehiclesWithAutomation.name });
                const response = await this.vehicleIntegration.addVehicle(vehicle);
                this.logger.debug({ message: 'ATG Add Vehicle Response:', detail: response, fn: this.syncVehiclesWithAutomation.name });
            } catch (error) {
                addFails.push({ error, vehicle });
                this.logger.error({ message: 'Failed to add vehicle to ATG', detail: error, fn: this.syncVehiclesWithAutomation.name });
            }
        }
        if (addFails.length > 0) {
            this.logger.error({
                message: 'Failed to add the following vehicles',
                detail: addFails,
                fn: this.syncVehiclesWithAutomation.name,
            });
        }

        const updatedVehicles = await Vehicle.createQueryBuilder('vehicle')
            .select([])
            .addSelect('vehicle.registration', 'vehicleId')
            .addSelect('MIN(contract."startDate")', 'startTime')
            .addSelect('MAX(contract."endDate")', 'endTime')
            .innerJoin('vehicle.contracts', 'contract')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('vehicle.createdAt < :date', {
                        date: moment().add('-1', 'day').toISOString(),
                    });
                    qb.andWhere(
                        new Brackets((innerQb) => {
                            innerQb.andWhere('vehicle.updatedAt >= :date', {
                                date: moment().add('-1', 'day').toISOString(),
                            });
                            innerQb.orWhere('contract.updatedAt >= :date', {
                                date: moment().add('-1', 'day').toISOString(),
                            });
                        }),
                    );
                }),
            )
            .groupBy('vehicle.registration')
            .getRawMany();

        const updateFails: any[] = [];
        for (const vehicle of updatedVehicles) {
            try {
                this.logger.debug({ message: 'Updating vehicle', detail: vehicle, fn: this.syncVehiclesWithAutomation.name });
                const response = await this.vehicleIntegration.updateVehicle(vehicle);
                this.logger.debug({ message: 'ATG Update Vehicle Response:', detail: response, fn: this.syncVehiclesWithAutomation.name });
            } catch (error) {
                updateFails.push({ error, vehicle });
                this.logger.error({ message: 'Failed to update vehicle to ATG', detail: error, fn: this.syncVehiclesWithAutomation.name });
            }
        }
        if (updateFails.length > 0) {
            this.logger.error({
                message: 'Failed to add the following vehicles',
                detail: updateFails,
                fn: this.syncVehiclesWithAutomation.name,
            });
        }

        this.logger.log({ message: 'Done Syncing Vehicles with ATG', detail: null, fn: this.syncVehiclesWithAutomation.name });
    }

    async initialSyncVehiclesWithAutomation(dto: InitialSyncDto) {
        this.logger.log({ message: 'Initial Syncing Vehicles with ATG', detail: null, fn: this.initialSyncVehiclesWithAutomation.name });
        const vehicleQuery = Vehicle.createQueryBuilder('vehicle')
            .select([])
            .addSelect('vehicle.registration', 'vehicleId')
            .addSelect('MIN(contract."startDate")', 'startTime')
            .addSelect('MAX(contract."endDate")', 'endTime')
            .innerJoin('vehicle.contracts', 'contract')
            .groupBy('vehicle.registration');

        if (dto.vehicleIds.length > 0) {
            vehicleQuery.where('vehicle.vehicleId IN (:...ids)', { ids: dto.vehicleIds });
        }
        const vehicles = await vehicleQuery.getRawMany();

        for (const vehicle of vehicles) {
            try {
                this.logger.debug({ message: 'Adding vehicle', detail: vehicle, fn: this.syncVehiclesWithAutomation.name });
                const response = await this.vehicleIntegration.addVehicle(vehicle);
                this.logger.debug({ message: 'ATG Add Vehicle Response:', detail: response, fn: this.syncVehiclesWithAutomation.name });

                const messageField = response.msgField;
                if (messageField.rcMessageField === 'error add action - vehicle already exists') {
                    this.logger.warn({
                        message: 'Updating vehicle, vehicle already exists',
                        detail: vehicle,
                        fn: this.syncVehiclesWithAutomation.name,
                    });
                    const updateResponse = await this.vehicleIntegration.updateVehicle(vehicle);
                    this.logger.debug({
                        message: 'ATG Update Vehicle Response:',
                        detail: updateResponse,
                        fn: this.syncVehiclesWithAutomation.name,
                    });
                }
            } catch (e) {
                this.logger.error({
                    message: 'Failed to add vehicle to ATG',
                    detail: {
                        error: e.message,
                        stack: e.stack,
                    },
                    fn: this.syncVehiclesWithAutomation.name,
                });
            }
        }
    }
}
