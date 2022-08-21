import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { LeaseContract } from '@entities';

@Injectable()
export class GetLeaseContractsService {
    constructor(private logger: Logger) {}

    async getLeaseContracts(): Promise<LeaseContract[]> {
        this.logger.log({ message: `Getting Lease Contracts`, detail: null, fn: this.getLeaseContracts.name });
        const leaseContracts = await LeaseContract.createQueryBuilder('leaseContract').getMany();
        this.logger.log({ message: `Found Lease Contracts, length: `, detail: leaseContracts.length, fn: this.getLeaseContracts.name });
        return leaseContracts;
    }
}
