import { Injectable } from '@nestjs/common';
import { DriverContract } from '@entities';
import { Brackets } from 'typeorm';

@Injectable()
export class FindExistingDriverContractService {
    /**
     * Creates a generalised search for an driver contract and returns the
     * contract if it exists.
     * @param vehicleRegistration The registration number of the vehicle
     * @param driver The driver's licenseNumber or idNumber
     * @param startDate The start date of the contract
     * @param endDate The end date of the contract
     */
    async find(vehicleRegistration: string | number, driver: string, startDate: string, endDate?: string) {
        const query = DriverContract.findWithMinimalRelations()
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('driver.licenseNumber = :licenseNumber', { licenseNumber: driver });
                    qb.orWhere('driver.idNumber = :idNumber', { idNumber: driver });
                }),
            )
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
