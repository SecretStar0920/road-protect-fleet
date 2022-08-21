import { Injectable } from '@nestjs/common';
import { Logger } from '@modules/shared/services/logger.service';
import { getConnection } from 'typeorm';

@Injectable()
export class AppService {
    constructor(private logger: Logger) {}

    async checkHealth() {
        const isConnected = getConnection().isConnected;
        return { dbConnected: isConnected };
    }
}
