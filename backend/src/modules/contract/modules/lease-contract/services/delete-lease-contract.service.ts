import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { LeaseContract } from '@entities';
import { Promax } from 'promax';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteLeaseContractService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<LeaseContract> {
        this.logger.log({ message: 'Deleting Lease Contract:', detail: id, fn: this.delete.name });
        const leaseContract = await LeaseContract.findOne(id);
        this.logger.log({ message: 'Found Lease Contract:', detail: id, fn: this.delete.name });
        if (!leaseContract) {
            this.logger.warn({ message: 'Could not find Lease Contract to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E039_CouldNotFindLeaseContractToDelete.message() });
        }

        await LeaseContract.remove(leaseContract);
        this.logger.log({ message: 'Deleted Lease Contract:', detail: id, fn: this.delete.name });
        return LeaseContract.create({ contractId: id });
    }

    async softDelete(id: number): Promise<LeaseContract> {
        this.logger.log({ message: 'Soft Deleting Lease Contract:', detail: id, fn: this.delete.name });
        const leaseContract = await LeaseContract.findOne(id);
        this.logger.log({ message: 'Found Lease Contract:', detail: id, fn: this.delete.name });
        if (!leaseContract) {
            this.logger.warn({ message: 'Could not find Lease Contract to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E039_CouldNotFindLeaseContractToDelete.message() });
        }

        // leaseContract.active = false; // FIXME
        await leaseContract.save();
        this.logger.log({ message: 'Soft Deleted Lease Contract:', detail: id, fn: this.delete.name });
        return leaseContract;
    }

    /**
     * This function allows you to clear the lease contracts that this account
     * OWNS from the system. I've added a variable to switch from ownership to
     * leaser but for now I want to ensure that we do not delete contracts from
     * customers on the system where they should exist.
     *
     * @param accountId The ID of the account that need to clear the contracts
     * from.
     * @param excludeIds The IDs to exclude when deleting the contract
     * @param owner Whether or not this should ensure if they're an owner of the
     * leases.
     */
    async deleteByAccountId(accountId: number, excludeIds: number[], owner = true) {
        this.logger.log({
            message: `Deleting all ${owner ? 'OWNED' : 'LEASED'} lease agreements for account id ${accountId}`,
            fn: this.deleteByAccountId.name,
            detail: { accountId, excludeIds, owner },
        });
        const initialQuery = LeaseContract.findWithMinimalRelations();
        if (owner) {
            initialQuery.where('owner.accountId = :accountId', { accountId });
        } else {
            initialQuery.where('user.accountId = :accountId', { accountId });
        }

        if (owner && excludeIds.length > 0) {
            initialQuery.andWhere('user.accountId NOT IN (:...excludeIds)', { excludeIds });
        } else if (!owner && excludeIds.length > 0) {
            // In this case is a leaser but the owner should be excluded
            initialQuery.andWhere('owner.accountId NOT IN (:...excludeIds)', { excludeIds });
        }

        const contracts = await initialQuery.getMany();

        this.logger.log({
            message: `Found ${contracts.length} contracts to delete for account id ${accountId}`,
            fn: this.deleteByAccountId.name,
            detail: { accountId, contracts },
        });
        const promax = new Promax(Config.get.systemPerformance.queryChunkSize, {
            throws: false,
        });
        await promax.add(contracts.map((contract) => () => this.delete(contract.contractId))).run();
        return promax.getResultMap();
    }
}
