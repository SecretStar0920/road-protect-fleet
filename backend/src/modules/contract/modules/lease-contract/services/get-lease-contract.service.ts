import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { LeaseContract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetLeaseContractService {
    constructor(private logger: Logger) {}

    async getLeaseContract(contractId: number): Promise<LeaseContract> {
        this.logger.log({ message: `Getting LeaseContract with id: `, detail: contractId, fn: this.getLeaseContract.name });
        const leaseContract = await LeaseContract.createQueryBuilder('leaseContract')
            .andWhere('leaseContract.contractId = :id', { id: contractId })
            .getOne();
        if (!leaseContract) {
            throw new BadRequestException({ message: ERROR_CODES.E126_CouldNotFindContract.message({ contractId }) });
        }
        this.logger.log({ message: `Found LeaseContract with id: `, detail: leaseContract.contractId, fn: this.getLeaseContract.name });
        return leaseContract;
    }
}
