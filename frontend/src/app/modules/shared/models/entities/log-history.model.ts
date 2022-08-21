import { Log } from '@modules/shared/models/entities/log.model';

interface LogDifferences {
    [key: string]: {
        old: string;
        new: string;
    };
}

export class LogHistory extends Log {
    differences?: LogDifferences[];
}
