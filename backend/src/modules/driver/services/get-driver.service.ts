import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Driver } from '@entities';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { isNil } from 'lodash';


@Injectable()
export class GetDriverService {
    constructor(private logger: Logger) {}

    async getDriver(driverIdentifier: number): Promise<Driver> {
        const driver = await Driver.findOne(driverIdentifier);
        if (isNil(driver)) {
            throw new BadRequestException({
                message: ERROR_CODES.E166_CouldNotFindDriver.message({ driverIdentifier }),
                identifier: driverIdentifier,
            });
        }

        return driver
    }
}
