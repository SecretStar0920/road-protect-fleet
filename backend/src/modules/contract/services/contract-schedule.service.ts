import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract, ContractStatus, LeaseContract, OwnershipContract, Vehicle } from '@entities';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { Brackets } from 'typeorm';
import { VehicleLeaseNotificationEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { isEmpty } from 'lodash';
import { LinkingService } from '@modules/shared/services/linking.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ContractScheduleService {
    constructor(private logger: Logger, private emailService: EmailService, private linkService: LinkingService) {}

    @Cron('*/1 * * * *')
    async updateCurrentVehicleContracts() {
        // Find all vehicles with missing contracts
        // That have contracts that could be valid
        const vehicleLeaseUpdates = await Vehicle.createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.currentLeaseContract', 'currentLeaseContract')
            .innerJoinAndSelect('vehicle.contracts', 'contracts')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere(`NOT tstzrange(currentLeaseContract.startDate, currentLeaseContract.endDate, '[]') @> CURRENT_TIMESTAMP`);
                    qb.orWhere('currentLeaseContract.contractId IS NULL');
                }),
            )
            .andWhere(`tstzrange(contracts.startDate, contracts.endDate, '[]') @> CURRENT_TIMESTAMP`)
            .andWhere('contracts.type = :type', { type: LeaseContract.name })
            .getMany();

        const vehicleOwnershipUpdates = await Vehicle.createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.currentOwnershipContract', 'currentOwnershipContract')
            .innerJoinAndSelect('vehicle.contracts', 'contracts')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere(
                        `NOT tstzrange(currentOwnershipContract.startDate, currentOwnershipContract.endDate, '[]') @> CURRENT_TIMESTAMP`,
                    );
                    qb.orWhere('currentOwnershipContract.contractId IS NULL');
                }),
            )
            .andWhere(`tstzrange(contracts.startDate, contracts.endDate, '[]') @> CURRENT_TIMESTAMP`)
            .andWhere('contracts.type = :type', { type: OwnershipContract.name })
            .getMany();

        const vehicles = [...vehicleLeaseUpdates, ...vehicleOwnershipUpdates];

        if (isEmpty(vehicles)) {
            return;
        }

        this.logger.debug({
            message: 'Resetting current contracts for vehicles',
            detail: vehicles.length,
            fn: this.updateCurrentVehicleContracts.name,
        });

        for (const vehicle of vehicles) {
            await this.linkService.relinkVehicleContracts(vehicle);
        }
    }

    @Cron('*/1 * * * * ') // every 5 minutes
    async updateExpiredLeases() {
        // this.logger.debug('ContractScheduler: updating contract statuses', null, this.updateExpiredLeases.name);
        const expiredLeases = await Contract.findExpired();

        if (isEmpty(expiredLeases)) {
            return;
        }

        this.logger.debug({
            message: `ContractScheduler: found ${expiredLeases.length} expired contract(s)`,
            detail: null,
            fn: this.updateExpiredLeases.name,
        });

        for (const expireLease of expiredLeases) {
            // this.logger.log(`ContractScheduler: setting contract ${expireLease.contractId} to Expired`,
            //     null, this.updateExpiredLeases.name);

            expireLease.status = ContractStatus.Expired;
            await expireLease.save();

            // this.sendNotification(expireLease, `The lease for vehicle with registration ${expireLease.vehicle.registration} has expired.`);

            this.logger.log({
                message: `ContractScheduler: set contract ${expireLease.contractId} to Expired`,
                detail: null,
                fn: this.updateExpiredLeases.name,
            });
        }
    }

    @Cron('*/1 * * * * ') // every 5 minutes
    async updateExpiringLeases() {
        // this.logger.debug('ContractScheduler: updating contract statuses', null, this.updateExpiringLeases.name);
        const expiringSoonLeases = await Contract.findExpiringSoon();

        if (isEmpty(expiringSoonLeases)) {
            return;
        }

        this.logger.debug({
            message: `ContractScheduler: found ${expiringSoonLeases.length} expiring contract(s)`,
            detail: null,
            fn: this.updateExpiringLeases.name,
        });

        for (const expiringLease of expiringSoonLeases) {
            // this.logger.log(`ContractScheduler: setting contract ${expiringLease.contractId} to ExpiringSoon`,
            //     null, this.updateExpiringLeases.name);

            expiringLease.status = ContractStatus.ExpiringSoon;
            await expiringLease.save();

            // this.sendNotification(
            //     expiringLease,
            //     `The lease for vehicle with registration ${expiringLease.vehicle.registration} is expiring soon.`,
            // );

            this.logger.log({
                message: `ContractScheduler: set contract ${expiringLease.contractId} to ExpiringSoon`,
                detail: null,
                fn: this.updateExpiringLeases.name,
            });
        }
    }

    async sendNotification(contract: Contract, message: string) {
        if (contract instanceof LeaseContract && contract.user) {
            try {
                const context: VehicleLeaseNotificationEmail = {
                    message,
                    name: contract.user.primaryContact,
                };
                await this.emailService.sendEmail({
                    template: EmailTemplate.VehicleLeaseNotification,
                    to: contract.user.primaryContact,
                    subject: 'Vehicle lease notification',
                    context: context,
                });
            } catch (e) {
                this.logger.error({
                    message: 'Failed to send vehicle lease notification email',
                    detail: e,
                    fn: this.sendNotification.name,
                });
            }
        }
        if (contract.owner) {
            try {
                const context: VehicleLeaseNotificationEmail = {
                    message,
                    name: contract.owner.primaryContact,
                };
                await this.emailService.sendEmail({
                    template: EmailTemplate.VehicleLeaseNotification,
                    to: contract.owner.primaryContact,
                    subject: 'Vehicle lease notification',
                    context: context,
                });
            } catch (e) {
                this.logger.error({
                    message: 'Failed to send vehicle lease notification email',
                    detail: e,
                    fn: this.sendNotification.name,
                });
            }
        }
    }
}
