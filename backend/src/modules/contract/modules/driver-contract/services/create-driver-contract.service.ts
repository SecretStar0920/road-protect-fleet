import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import * as moment from 'moment';
import { isNil } from 'lodash';
import { CreateContractService } from '@modules/contract/services/create-contract.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { convertToIsoString } from '@modules/shared/helpers/timezone-conversion';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { FindExistingDriverContractService } from '@modules/contract/modules/driver-contract/services/find-existing-driver-contract.service';
import { CreateDriverContractDto } from '@modules/contract/modules/driver-contract/controllers/create-driver-contract.dto';
import { UpdateDriverContractService } from '@modules/contract/modules/driver-contract/services/update-driver-contract.service';
import { CONTRACT_CONSTRAINTS, ContractStatus, Driver, DriverContract, Vehicle } from '@entities';
import { LinkingService } from '@modules/shared/services/linking.service';

@Injectable()
export class CreateDriverContractService extends CreateContractService {
    constructor(
        protected logger: Logger,
        private findExistingDriverContractService: FindExistingDriverContractService,
        protected linkingService: LinkingService,
        private updateDriverContractService: UpdateDriverContractService,
    ) {
        super(logger, linkingService);
    }

    @Transactional()
    async upsertDriverContract(dto: CreateDriverContractDto): Promise<DriverContract> {
        const found = await this.findExistingDriverContractService.find(dto.vehicle, dto.driver, dto.startDate, dto.endDate);
        if (found) {
            this.logger.warn({
                message: `A user is trying to create a driver contract that already exists`,
                detail: dto,
                fn: this.upsertDriverContract.name,
            });
            return await this.updateDriverContractService.update(found.contractId, {
                document: dto.document,
                reference: dto.reference,
            });
        }
        return this.createDriverContract(dto);
    }

    @Transactional()
    async createDriverContract(dto: CreateDriverContractDto): Promise<DriverContract> {
        this.logger.debug({
            message: 'Creating Vehicle Driver Contract',
            detail: dto,
            fn: this.createDriverContract.name,
        });

        let contract = await this.createOnly(dto);
        const document = await this.checkDocumentRelation(dto.document);

        try {
            if (!isNil(document)) {
                contract.document = document;
            }
            contract = await contract.save();
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to create Driver contract, please contact the developers.');
        }

        this.logger.debug({
            message: 'Created Vehicle Contract',
            detail: contract.contractId,
            fn: this.createDriverContract.name,
        });
        return contract;
    }

    @Transactional()
    async createOnly(dto: CreateDriverContractDto, vehicle?: Vehicle) {
        const driver = await this.checkDriverRelations(dto.driver);
        if (isNil(driver)) {
            throw new BadRequestException({ message: ERROR_CODES.E167_DriverMustBeDefinedCreatingContract.message() });
        }
        const foundVehicle = vehicle ? vehicle : await this.checkVehicleRelation(dto.vehicle);

        // Check overlapping (not entirely necessary since we have database exclusion check
        await this.checkOverlappingDriver(foundVehicle.vehicleId, dto.startDate, dto.endDate);

        let status = ContractStatus.Valid;
        if (moment().isAfter(dto.endDate)) {
            status = ContractStatus.Expired;
        } else if (moment().isBefore(dto.startDate)) {
            status = ContractStatus.Upcoming;
        }

        const contract = DriverContract.create({
            startDate: convertToIsoString(dto.startDate),
            endDate: dto.endDate ? convertToIsoString(dto.endDate) : null,
            vehicle: foundVehicle,
            driver,
            status,
            reference: dto.reference,
        });

        return contract;
    }

    @Transactional()
    async checkDriverRelations(driverIdentifier: string): Promise<Driver> {
        let driver: Driver;
        if (driverIdentifier) {
            driver = await Driver.findByLicenseOrId(driverIdentifier);
            if (isNil(driver)) {
                throw new BadRequestException({
                    message: ERROR_CODES.E166_CouldNotFindDriver.message({ driverIdentifier }),
                    identifier: driverIdentifier,
                });
            }
        }
        return driver;
    }

    @Transactional()
    async checkOverlappingDriver(vehicleId: number, startDate: string, endDate: string) {
        const [overlapping, overlapCount] = await DriverContract.checkOverlapping(vehicleId, startDate, endDate).getManyAndCount();
        if (overlapCount > 0) {
            throw new BadRequestException({
                message: ERROR_CODES.E038_ProvidedDatesOverlapWithExistingContract.message(),
                overlaps: overlapCount,
                overlapping: overlapping.map((overlap) => {
                    return {
                        ...overlap,
                        startDate: moment(overlap.startDate).format(),
                        endDate: moment(overlap.endDate).format(),
                    };
                }),
            });
        }
    }
}
