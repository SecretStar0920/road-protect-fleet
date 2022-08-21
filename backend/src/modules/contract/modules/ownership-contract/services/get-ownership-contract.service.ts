import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { OwnershipContract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetOwnershipContractService {
    constructor(private logger: Logger) {}

    async getOwnershipContract(contractId: number): Promise<OwnershipContract> {
        this.logger.log({ message: `Getting OwnershipContract with id: `, detail: contractId, fn: this.getOwnershipContract.name });
        const ownershipContract = await OwnershipContract.createQueryBuilder('ownershipContract')
            .andWhere('ownershipContract.contractId = :id', { id: contractId })
            .getOne();
        if (!ownershipContract) {
            throw new BadRequestException({ message: ERROR_CODES.E126_CouldNotFindContract.message({ contractId }) });
        }
        this.logger.log({
            message: `Found OwnershipContract with id: `,
            detail: ownershipContract.contractId,
            fn: this.getOwnershipContract.name,
        });
        return ownershipContract;
    }
}
