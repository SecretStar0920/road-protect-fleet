import { Injectable } from '@nestjs/common';
import { DriverContract } from '@entities';
import { Logger } from '@logger';

@Injectable()
export class DriverRedirectionService {
    constructor(private logger: Logger) {}
    // Returns a driver contract if there is one at the infringement offence date
    async getDriverContract(infringementId: number): Promise<DriverContract> {
        return await DriverContract.createQueryBuilder('contract')
            .leftJoin('contract.driver', 'driver')
            .addSelect([
                'driver.name',
                'driver.surname',
                'driver.driverId',
                'driver.idNumber',
                'driver.licenseNumber',
                'driver.email',
                'driver.cellphoneNumber',
            ])
            .leftJoin('contract.vehicle', 'vehicle')
            .leftJoin('vehicle.infringements', 'infringement')
            .andWhere('contract.startDate < infringement.offenceDate')
            //   .andWhere('contract.endDate > infringement.offenceDate')
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .getOne();
    }
}
