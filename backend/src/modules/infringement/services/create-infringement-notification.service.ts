import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Infringement, Notification } from '@entities';

@Injectable()
export class CreateInfringementNotification {
    constructor(private logger: Logger) {}

    // @Transactional({ propagation: Propagation.NESTED })
    async createInfringementNotifications(infringement: Infringement, vehicleExisted: boolean) {
        // TODO: Add backend translations
        // TODO: Part 2 | Check if the infringement received after working hours (per account) and notify the account
        // TODO: Part 2 | Check latest infringement to the same vehicle and notify if less than 2 hours difference between them
        // TODO: Part 2 | Check vehicle actual location with ituran integration
        // TODO: Part 2 | Add to infringement-schedule service that checks if the infringement was approved for payment a week+ ago and were not payed yet
        if (Number(infringement.amountDue) > 250) {
            this.notifyAccounts(infringement, 'שים לב! התקבל קנס מעל 250 ₪');
        }
        if (!vehicleExisted) {
            this.notifyAccounts(infringement, 'שים לב! התקבל קנס על רכב שלא נמצא במערכת');
        }
    }

    // @Transactional()
    async notifyAccounts(infringement: Infringement, message: string) {
        try {
            if (infringement.brn) {
                const account = await Account.findByIdentifierOrId(infringement.brn);
                const notification = { account, infringement, message };
                await Notification.createAndSave(notification);
                this.logger.debug({
                    fn: this.notifyAccounts.name,
                    detail: notification,
                    message: 'Created account infringement notification',
                });
            } else {
                // FIXME: logic is wrong here, should not be using current contracts
                if (infringement.vehicle.currentLeaseContract) {
                    const user: Account = infringement.vehicle.currentLeaseContract.user;
                    const userNotification = { account: user, infringement, message };
                    await Notification.createAndSave(userNotification);

                    const owner: Account = infringement.vehicle.currentLeaseContract.owner;
                    const ownerNotification = { account: owner, infringement, message };
                    await Notification.createAndSave(ownerNotification);

                    this.logger.debug({
                        fn: this.notifyAccounts.name,
                        detail: { ownerNotification, userNotification },
                        message: 'Created account infringement notification',
                    });
                } else if (infringement.vehicle.currentOwnershipContract) {
                    const owner: Account = infringement.vehicle.currentOwnershipContract.owner;
                    const ownerNotification = { account: owner, infringement, message };
                    await Notification.createAndSave(ownerNotification);
                    this.logger.debug({
                        fn: this.notifyAccounts.name,
                        detail: ownerNotification,
                        message: 'Created account infringement notification',
                    });
                }
            }
        } catch (e) {
            this.logger.error({
                message: 'Failed to create notification',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.notifyAccounts.name,
            });
        }
    }
}
