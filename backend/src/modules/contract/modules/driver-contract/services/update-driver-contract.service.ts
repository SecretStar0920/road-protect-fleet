import { BadRequestException, Injectable } from '@nestjs/common';
import { isNil, merge } from 'lodash';
import { Logger } from '@logger';
import { CONTRACT_CONSTRAINTS, Document, DriverContract } from '@entities';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';
import { LinkingService } from '@modules/shared/services/linking.service';
import * as moment from 'moment';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { UpdateDriverContractDto } from '@modules/contract/modules/driver-contract/controllers/update-driver-contract.dto';
import { Brackets } from 'typeorm';

@Injectable()
export class UpdateDriverContractService extends UpdateContractService {
    constructor(protected logger: Logger, protected linkingService: LinkingService) {
        super(logger, linkingService);
    }

    async updateFromSpreadsheet(dto: UpdateDriverContractDto): Promise<DriverContract> {
        this.logger.log({ message: 'Updating Driver Contract: ', detail: dto, fn: this.updateFromSpreadsheet.name });

        const driverContract = await DriverContract.createQueryBuilder('driverContract')
            .innerJoinAndSelect('driverContract.driver', 'driver')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('driver.licenseNumber = :licenseNumber', { licenseNumber: dto.driver });
                    qb.orWhere('driver.idNumber = :idNumber', { idNumber: dto.driver });
                }),
            )
            .innerJoinAndSelect('driverContract.vehicle', 'vehicle')
            .andWhere('vehicle.registration = :registration', { registration: dto.vehicle })
            .getOne();

        if (isNil(driverContract)) {
            throw new BadRequestException({ message: `Could not find driver contract to update` });
        }

        try {
            const updateObject: Partial<DriverContract> = {};
            if (dto.endDate) {
                updateObject.endDate = moment(dto.endDate).toISOString();
            }
            if (dto.startDate) {
                updateObject.startDate = dto.startDate;
            }
            if (dto.reference) {
                updateObject.reference = dto.reference;
            }
            if (dto.document) {
                updateObject.document = await Document.findByDocumentId(dto.document).getOne();
            }
            await DriverContract.update(driverContract.contractId, updateObject);
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to update driver contract, please contact the developers.');
        }

        return driverContract;
    }

    async update(id: number, dto: UpdateDriverContractDto): Promise<DriverContract> {
        this.logger.log({ message: 'Updating driver Contract: ', detail: merge({ id }, dto), fn: this.update.name });
        const driverContract = await DriverContract.findById(id);
        if (dto.document) {
            await this.updateContractDocumentById(driverContract.contractId, {
                documentId: dto.document,
            });
        }
        if (dto.reference) {
            driverContract.reference = dto.reference;
        }
        await driverContract.save();
        this.logger.log({
            message: 'Updated Driver Contract: ',
            detail: {
                id,
                dto,
            },
            fn: this.update.name,
        });
        return driverContract;
    }
}
