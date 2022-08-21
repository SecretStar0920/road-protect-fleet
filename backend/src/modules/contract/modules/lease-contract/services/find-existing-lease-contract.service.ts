import { Injectable } from '@nestjs/common';
import { LeaseContract } from '@entities';

@Injectable()
export class FindExistingLeaseContractService {
    /**
     * Creates a generalised search for an ownership contract and returns the
     * contract if it exists.
     * @param vehicleRegistration The registration number of the vehicle
     * @param owner The owner BRN of the vehicle
     * @param user The user BRN of the vehicle
     * @param startDate The start date of the contract
     * @param endDate The end date of the contract
     */
    async find(vehicleRegistration: string | number, owner: string, user: string, startDate: string, endDate: string) {
        const query = LeaseContract.findWithMinimalRelations()
            .where('owner.identifier = :owner', { owner })
            .andWhere('user.identifier = :user', { user })
            .andWhere('contract.startDate = :startDate', { startDate })
            .andWhere('vehicle.registration = :vehicleRegistration', { vehicleRegistration });

        if (endDate) {
            query.andWhere('contract.endDate = :endDate', { endDate });
        } else {
            query.andWhere('contract.endDate IS NULL');
        }

        return query.getOne();
    }
}
