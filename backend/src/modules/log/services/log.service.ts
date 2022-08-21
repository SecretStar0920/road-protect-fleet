import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Infringement, Log, LogType, User, Vehicle } from '@entities';
import { isObject } from 'lodash';

export interface LogAndDifferences {
    logId: number;
    type: LogType;
    message: string;
    user?: User;
    account?: Account;
    vehicle?: Vehicle;
    infringement?: Infringement;
    differences?: LogDifferences[];
}
interface LogDifferences {
    [key: string]: {
        old: any;
        new: any;
    };
}

export interface LogParameters {
    vehicleId?: number;
    accountId?: number;
    userId?: number;
    infringementId?: number;
}

@Injectable()
export class LogService {
    constructor(private logger: Logger) {}

    async getAllLogsAndHistory(params: LogParameters): Promise<LogAndDifferences> {
        const logHistory: any = await Log.findWithHistory(params).getMany();
        this.logger.log({ message: `Found ${logHistory.length} Logs.`, fn: this.getAllLogsAndHistory.name });
        // There are multiple infringement histories per log, the overall differences are found by comparing all the new and old infringements on the histories
        for (const log of logHistory) {
            log.differences = await this.findDifferences(log);
            // The history is removed to reduce the size of the object
            delete log.infringement?.infringementRevisionHistory;
        }
        return logHistory;
    }

    async findDifferences(log: Log): Promise<LogDifferences> {
        let differences = {};
        // Infringement History
        if (!log.infringement?.infringementRevisionHistory) {
            return differences;
        } else {
            log.infringement.infringementRevisionHistory.forEach((history) => {
                const changes = this.diff(history.old, history.new);
                differences = { ...differences, ...changes };
            });
        }
        return differences;
    }

    // Compare the old and new objects to determine the changes made
    diff(oldObj, newObj) {
        const result = {};
        for (const prop in oldObj) {
            if (prop === 'updatedAt') {
                // Ignore change in updatedAt
            } else if (isObject(newObj[prop])) {
                // Currently, differences of type object are not displayed and are removed here
            } else if (newObj[prop] && newObj[prop] !== oldObj[prop]) {
                result[prop] = { old: oldObj[prop], new: newObj[prop] };
            }
        }
        return result;
    }
}
