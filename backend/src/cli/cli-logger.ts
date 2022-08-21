import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CliLogger implements LoggerService {
    constructor() {}

    log(message: string) {
        // Do nothing
    }

    error(message: string, trace: string) {
        // Do nothing
    }

    warn(message: string) {
        // Do nothing
    }
}
