import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract } from '@entities';
import { cloneDeep } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteContractService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteContract(id: number): Promise<Contract> {
        this.logger.log({ message: 'Deleting Vehicle Contract:', detail: id, fn: this.deleteContract.name });
        const contract = await Contract.findWithMinimalRelations().andWhere('contract.contractId = :id', { id }).getOne();
        this.logger.log({ message: 'Found Vehicle Contract:', detail: id, fn: this.deleteContract.name });
        if (!contract) {
            this.logger.warn({ message: 'Could not find Vehicle Contract to delete', detail: id, fn: this.deleteContract.name });
            throw new BadRequestException({ message: ERROR_CODES.E035_CouldNotFindContractToDelete.message() });
        }

        await Contract.remove(cloneDeep(contract));
        this.logger.log({ message: 'Deleted Vehicle Contract:', detail: id, fn: this.deleteContract.name });
        return contract;
    }

    async softDelete(id: number): Promise<Contract> {
        this.logger.log({ message: 'Soft Deleting Vehicle Contract:', detail: id, fn: this.deleteContract.name });
        const contract = await Contract.findOne(id);
        this.logger.log({ message: 'Found Vehicle Contract:', detail: id, fn: this.deleteContract.name });
        if (!contract) {
            this.logger.warn({ message: 'Could not find Vehicle Contract to delete', detail: id, fn: this.deleteContract.name });
            throw new BadRequestException({ message: ERROR_CODES.E035_CouldNotFindContractToDelete.message() });
        }

        // contract.active = false;
        await contract.save();
        this.logger.log({ message: 'Soft Deleted Vehicle Contract:', detail: id, fn: this.deleteContract.name });
        return contract;
    }
}
