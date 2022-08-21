import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetContractService {
    constructor(private logger: Logger) {}

    async getContract(contractId: number): Promise<Contract> {
        this.logger.log({ message: `Getting Vehicle Contract with id: `, detail: contractId, fn: this.getContract.name });
        const contract = await Contract.findWithMinimalRelations().where('contract.contractId = :id', { id: contractId }).getOne();
        if (!contract) {
            throw new BadRequestException({ message: ERROR_CODES.E126_CouldNotFindContract.message({ contractId }) });
        }
        this.logger.log({ message: `Found Vehicle Contract with id: `, detail: contract.contractId, fn: this.getContract.name });
        return contract;
    }
}
