import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Driver } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { CreateDriverDto } from '@modules/driver/dtos/create-driver.dto';
import { CreateLocationService } from '@modules/location/services/create-location.service';
import { CreateDriverSpreadsheetDto } from '@modules/driver/dtos/create-driver-spreadsheet.dto';
import { UpdateDriverDto } from '@modules/driver/dtos/update-driver.dto';
import { isNil, merge } from 'lodash';

@Injectable()
export class CreateDriverService {
    constructor(private logger: Logger, private createLocationService: CreateLocationService) {}

    @Transactional()
    async createDriver(dto: CreateDriverDto): Promise<Driver> {
        this.logger.debug({ message: 'Creating a driver', fn: this.createDriver.name });
        let driver: Driver;
        try {
            // 1.Create the driver
            driver = await Driver.create(dto);
            // 2. Also create the location
            if (dto.physicalLocation) {
                driver.physicalLocation = await this.createLocationService.savePhysicalLocationV2(dto.physicalLocation);
            }
            if (dto.postalLocation) {
                driver.postalLocation = await this.createLocationService.savePostalLocationV2(dto.postalLocation);
            }
            // 3. Save the account
            driver = await Driver.save(driver);
        } catch (e) {
            this.logger.error({
                message: 'Failed to create driver on create',
                detail: { error: e, dto },
                fn: this.createDriver.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E165_FailedToCreateDriver.message(), e });
        }
        this.logger.debug({
            message: 'Created Driver',
            detail: driver,
            fn: this.createDriver.name,
        });
        return driver;
    }

    @Transactional()
    async updateDriver(driverId: number, dto: UpdateDriverDto): Promise<Driver> {
        this.logger.debug({ message: 'Creating a driver', fn: this.createDriver.name });
        let driver = await Driver.findOne(driverId);
        if (isNil(driver)) {
            throw new BadRequestException({
                message: ERROR_CODES.E166_CouldNotFindDriver.message({ driverId }),
                identifier: driverId,
            });
        }

        try {
            if (dto.physicalLocation) {
                driver.physicalLocation = await this.createLocationService.savePhysicalLocationV2(dto.physicalLocation);
            }
            if (dto.postalLocation) {
                driver.postalLocation = await this.createLocationService.savePostalLocationV2(dto.postalLocation);
            }

            driver = merge(driver, dto)
            driver = await Driver.save(driver);
        } catch (e) {
            this.logger.error({
                message: 'Failed to update driver',
                detail: { error: e, dto },
                fn: this.createDriver.name,
            });

            throw new BadRequestException({ message: ERROR_CODES.E170_FailedToUpdateDriver.message(), e });
        }
        this.logger.debug({
            message: 'Updated Driver',
            detail: driver,
            fn: this.createDriver.name,
        });
        return driver;
    }

    @Transactional()
    async createSpreadsheetDriver(dto: CreateDriverSpreadsheetDto): Promise<Driver> {
        this.logger.debug({ message: 'Creating a driver', detail: dto, fn: this.createSpreadsheetDriver.name });
        let driver: Driver;
        try {
            // 1.Create the driver
            driver = await Driver.create(dto);

            // 2. Also create the location
            await this.createLocations(dto, driver);

            // 3. Save the account
            driver = await Driver.save(driver);
        } catch (e) {
            this.logger.error({
                message: 'Failed to create driver on create',
                detail: { error: e, dto },
                fn: this.createDriver.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E165_FailedToCreateDriver.message(), e });
        }
        this.logger.debug({
            message: 'Created Driver',
            detail: driver,
            fn: this.createDriver.name,
        });
        return driver;
    }

    private async createLocations(dto: CreateDriverSpreadsheetDto, driver: Driver) {
        const locations = await this.createLocationService.validateAndInferLocations(dto);
        if (locations.validations.Both.valid) {
            driver.physicalLocation = await this.createLocationService.savePhysicalLocation(locations.dto);
            driver.postalLocation = await this.createLocationService.savePostalLocation(locations.dto);
        } else if (locations.validations.Physical.valid) {
            driver.physicalLocation = await this.createLocationService.savePhysicalLocation(locations.dto);
        } else if (locations.validations.Postal.valid) {
            driver.postalLocation = await this.createLocationService.savePostalLocation(locations.dto);
        } else {
            throw new BadRequestException({
                message: ERROR_CODES.E117_NoValidLocationsProvided.message(),
                detail: locations.validations,
            });
        }
    }
}
