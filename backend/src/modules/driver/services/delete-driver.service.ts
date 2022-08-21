import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { Driver } from '@entities';

@Injectable()
export class DeleteDriverService {
    constructor(private logger: Logger) {}

    async deleteDriver(id: number): Promise<Driver> {
        const driver = await Driver.findOne(id);
        this.logger.debug({ message: 'Found Driver:', detail: id, fn: this.deleteDriver.name });
        if (!driver) {
            this.logger.warn({
                message: 'Could not find Driver to delete',
                detail: id,
                fn: this.deleteDriver.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E141_AccountNotFoundForRedirection.message() });
        }

        await Driver.remove(driver);
        return Driver.create({ driverId: id });
    }
}
