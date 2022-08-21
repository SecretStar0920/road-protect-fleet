import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { OwnershipContract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteOwnershipContractService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<OwnershipContract> {
        this.logger.log({ message: 'Deleting Ownership Contract:', detail: id, fn: this.delete.name });
        const ownershipContract = await OwnershipContract.findOne(id);
        this.logger.log({ message: 'Found Ownership Contract:', detail: id, fn: this.delete.name });
        if (!ownershipContract) {
            this.logger.warn({ message: 'Could not find Ownership Contract to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E035_CouldNotFindContractToDelete.message() });
        }

        await OwnershipContract.remove(ownershipContract);
        this.logger.log({ message: 'Deleted Ownership Contract:', detail: id, fn: this.delete.name });
        return OwnershipContract.create({ contractId: id });
    }

    async softDelete(id: number): Promise<OwnershipContract> {
        this.logger.log({ message: 'Soft Deleting Ownership Contract:', detail: id, fn: this.delete.name });
        const ownershipContract = await OwnershipContract.findOne(id);
        this.logger.log({ message: 'Found Ownership Contract:', detail: id, fn: this.delete.name });
        if (!ownershipContract) {
            this.logger.warn({ message: 'Could not find Ownership Contract to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E035_CouldNotFindContractToDelete.message() });
        }

        // ownershipContract.active = false; // FIXME
        await ownershipContract.save();
        this.logger.log({ message: 'Soft Deleted Ownership Contract:', detail: id, fn: this.delete.name });
        return ownershipContract;
    }
}
