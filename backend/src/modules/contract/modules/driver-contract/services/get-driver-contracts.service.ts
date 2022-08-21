import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { DriverContract } from '@entities';

@Injectable()
export class GetDriverContractsService {
    constructor(private logger: Logger) {}

    async getDriverContracts(): Promise<DriverContract[]> {
        this.logger.log({ message: `Getting driver contracts`, detail: null, fn: this.getDriverContracts.name });
        const driverContracts = await DriverContract.createQueryBuilder('driverContract').getMany();
        this.logger.log({
            message: `Found driver Contracts, length: `,
            detail: driverContracts.length,
            fn: this.getDriverContracts.name,
        });
        return driverContracts;
    }
}
