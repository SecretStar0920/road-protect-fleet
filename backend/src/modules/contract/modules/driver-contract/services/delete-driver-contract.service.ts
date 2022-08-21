import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { DriverContract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteDriverContractService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<DriverContract> {
        this.logger.log({ message: 'Deleting Driver Contract:', detail: id, fn: this.delete.name });
        const driverContract = await DriverContract.findOne(id);
        this.logger.log({ message: 'Found Driver Contract:', detail: id, fn: this.delete.name });
        if (!driverContract) {
            this.logger.warn({ message: 'Could not find Driver Contract to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E035_CouldNotFindContractToDelete.message() });
        }

        await DriverContract.remove(driverContract);
        this.logger.log({ message: 'Deleted Driver Contract:', detail: id, fn: this.delete.name });
        return DriverContract.create({ contractId: id });
    }

    async softDelete(id: number): Promise<DriverContract> {
        this.logger.log({ message: 'Soft Deleting Driver Contract:', detail: id, fn: this.delete.name });
        const driverContract = await DriverContract.findOne(id);
        this.logger.log({ message: 'Found Driver Contract:', detail: id, fn: this.delete.name });
        if (!driverContract) {
            this.logger.warn({ message: 'Could not find Driver Contract to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E035_CouldNotFindContractToDelete.message() });
        }

        await driverContract.save();
        this.logger.log({ message: 'Soft Deleted Driver Contract:', detail: id, fn: this.delete.name });
        return driverContract;
    }
}
