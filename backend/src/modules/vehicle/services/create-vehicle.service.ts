import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Contract, LeaseContract, LogPriority, Vehicle, VEHICLE_CONSTRAINTS } from '@entities';
import { CreateVehicleDto } from '@modules/vehicle/controllers/create-vehicle.dto';
import { isNil } from 'lodash';
import { VehicleAdditionEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { UpdateVehicleService } from '@modules/vehicle/services/update-vehicle.service';
import { GetVehicleService } from '@modules/vehicle/services/get-vehicle.service';
import { Log, LogType } from '@modules/shared/entities/log.entity';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class CreateVehicleService {
    constructor(
        private logger: Logger,
        private emailService: EmailService,
        private updateVehicleService: UpdateVehicleService,
        private getVehicleService: GetVehicleService,
    ) {}

    @Transactional()
    async createVehicle(dto: CreateVehicleDto, sendNotification: boolean = true): Promise<Vehicle> {
        this.logger.debug({ message: 'Creating Vehicle', detail: dto, fn: this.createVehicle.name });

        // Check existing
        const foundVehicle = await Vehicle.findOneByRegistrationOrId(dto.registration);
        if (!isNil(foundVehicle)) {
            this.logger.debug({ message: 'Vehicle already exists, updating', detail: dto, fn: this.createVehicle.name });
            return this.updateExistingVehicle(foundVehicle, dto);
        }

        // Create vehicle
        let vehicle = await Vehicle.create(dto);

        // Attempt save
        try {
            vehicle = await vehicle.save();
        } catch (e) {
            databaseExceptionHelper(e, VEHICLE_CONSTRAINTS, 'Failed to create vehicle, please contact the developers.');
        }

        // Re-finding again to return standard vehicle response
        vehicle = await this.getVehicleService.getVehicle(vehicle.vehicleId);
        this.logger.debug({ message: 'Created Vehicle', detail: vehicle.vehicleId, fn: this.createVehicle.name });
        return vehicle;
    }

    private async createLogsAndNotifications(vehicle, sendNotification: boolean, contract: Contract) {
        await Log.createAndSave({ vehicle, type: LogType.Created, message: 'Vehicle', priority: LogPriority.High });
        if (sendNotification) {
            if (contract.owner) {
                // this.sendNotification(contract.owner, 'owner', vehicle);
                await Log.createAndSave({
                    vehicle,
                    account: contract.owner,
                    type: LogType.Created,
                    message: 'Set vehicle owner',
                    priority: LogPriority.High,
                });
            }
            if (contract instanceof LeaseContract && contract.user) {
                // this.sendNotification(contract.user, 'user', vehicle);
                await Log.createAndSave({
                    vehicle,
                    account: contract.user,
                    type: LogType.Created,
                    message: 'Set vehicle user',
                    priority: LogPriority.High,
                });
            }
        }
    }

    @Transactional()
    private updateExistingVehicle(foundVehicle, dto: CreateVehicleDto) {
        return this.updateVehicleService.updateVehicle(foundVehicle.vehicleId, dto);
    }

    async sendNotification(account: Account, type: 'owner' | 'user', vehicle: Vehicle) {
        try {
            const context: VehicleAdditionEmail = {
                vehicleRegistration: vehicle.registration,
                name: account.primaryContact,
                accountName: account.name,
                type,
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.VehicleAddition,
                to: account.primaryContact,
                subject: 'Vehicle addition',
                context: context,
            });
        } catch (e) {
            this.logger.error({
                message: 'Failed to send account creation email',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.sendNotification.name,
            });
        }
    }
}
