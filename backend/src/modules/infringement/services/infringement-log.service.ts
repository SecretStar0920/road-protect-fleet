import { Injectable } from '@nestjs/common';
import { Account, Infringement, Log, LogType, User, Vehicle } from '@entities';

export interface PartialLog {
    type: LogType;
    message: string;
    infringement: {
        infringementId: number;
    };
    account?: {
        accountId: number;
    };
    user?: {
        userId: number;
    };
    vehicle?: {
        vehicleId: number;
    };
}

@Injectable()
export class InfringementLogService {
    /**
     * Creates the log based on a partial log entity
     * @param log
     */
    async createLog(log: PartialLog) {
        return await Log.createAndSave({
            type: log.type,
            message: log.message,
            infringement: Infringement.create(log.infringement),
            account: Account.create(log.account),
            user: User.create(log.user),
            vehicle: Vehicle.create(log.vehicle),
        });
    }
}
