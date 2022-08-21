import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { OwnershipContract } from '@entities';

@Injectable()
export class GetOwnershipContractsService {
    constructor(private logger: Logger) {}

    async getOwnershipContracts(): Promise<OwnershipContract[]> {
        this.logger.log({ message: `Getting Ownership Contracts`, detail: null, fn: this.getOwnershipContracts.name });
        const ownershipContracts = await OwnershipContract.createQueryBuilder('ownershipContract').getMany();
        this.logger.log({
            message: `Found Ownership Contracts, length: `,
            detail: ownershipContracts.length,
            fn: this.getOwnershipContracts.name,
        });
        return ownershipContracts;
    }
}
