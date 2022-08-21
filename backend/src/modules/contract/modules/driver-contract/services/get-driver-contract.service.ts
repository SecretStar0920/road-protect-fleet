import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { DriverContract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetDriverContractService {
    constructor(private logger: Logger) {}

    async getDriverContract(contractId: number): Promise<DriverContract> {
        this.logger.log({ message: `Getting Driver Contract with id: `, detail: contractId, fn: this.getDriverContract.name });
        const driverContract = await DriverContract.createQueryBuilder('driverContract')
            .andWhere('driverContract.contractId = :id', { id: contractId })
            .getOne();
        if (!driverContract) {
            throw new BadRequestException({ message: ERROR_CODES.E126_CouldNotFindContract.message({ contractId }) });
        }
        this.logger.log({
            message: `Found Driver Contract with id: `,
            detail: driverContract.contractId,
            fn: this.getDriverContract.name,
        });
        return driverContract;
    }
}
