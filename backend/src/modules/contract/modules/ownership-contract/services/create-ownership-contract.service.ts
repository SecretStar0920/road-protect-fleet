import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract, CONTRACT_CONSTRAINTS, ContractStatus, OwnershipContract, Vehicle } from '@entities';
import * as moment from 'moment';
import { LinkingService } from '@modules/shared/services/linking.service';
import { isNil } from 'lodash';
import { CreateContractService } from '@modules/contract/services/create-contract.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { convertToIsoString } from '@modules/shared/helpers/timezone-conversion';
import { FindExistingOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/find-existing-ownership-contract.service';
import { UpdateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/update-ownership-contract.service';
import { CreateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/create-ownership-contract.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';


@Injectable()
export class CreateOwnershipContractService extends CreateContractService {
    constructor(
        protected logger: Logger,
        protected linkingService: LinkingService,
        private findExistingOwnershipContractService: FindExistingOwnershipContractService,
        private updateOwnershipContractService: UpdateOwnershipContractService,
        private updateContractService: UpdateContractService,
       
        ) {
        super(logger, linkingService);
    }

    @Transactional()
    async upsertOwnershipContractAndLinkInfringements(dto: CreateOwnershipContractDto): Promise<OwnershipContract> {
        const found = await this.findExistingOwnershipContractService.find(dto.vehicle, dto.owner, dto.startDate, dto.endDate);
        if (found) {
            this.logger.warn({
                message: `A user is trying to create an ownership contract that already exists`,
                detail: dto,
                fn: this.upsertOwnershipContractAndLinkInfringements.name,
            });
            return await this.updateOwnershipContractService.update(found.contractId, {
                document: dto.document,
                reference: dto.reference,
            });
        }
        return this.createOwnershipContractAndLinkInfringements(dto);
    }

    @Transactional()
    async createOwnershipContractAndLinkInfringements(dto: CreateOwnershipContractDto): Promise<OwnershipContract> {
        this.logger.debug({
            message: 'Creating Vehicle Ownership Contract',
            detail: dto,
            fn: this.createOwnershipContractAndLinkInfringements.name,
        });

        let contract = await this.createOnly(dto);
        const document = await this.checkDocumentRelation(dto.document);

        try {
            if (!isNil(document)) {
                contract.document = document;
            }
            contract = await contract.save();
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to create ownership contract, please contact the developers.');
        }

        await this.linkingService.relinkContractInfringements(contract);
        await this.linkingService.relinkVehicleContracts(contract.vehicle);

        this.logger.debug({
            message: 'Created Vehicle Contract',
            detail: contract.contractId,
            fn: this.createOwnershipContractAndLinkInfringements.name,
        });
        return contract;
    }

    @Transactional()
    async createOnly(dto: CreateOwnershipContractDto, vehicle?: Vehicle) {
        const owner = await this.checkAccountRelations(dto.owner);
        if (isNil(owner)) {
            throw new BadRequestException({ message: ERROR_CODES.E118_OwnerMustBeDefinedCreatingContract.message() });
        }
        const foundVehicle = vehicle ? vehicle : await this.checkVehicleRelation(dto.vehicle);

        // Check overlapping (not entirely necessary since we have database exclusion check
        await this.checkOverlappingOwnership(foundVehicle.vehicleId, dto.startDate, dto.endDate);

        let status = ContractStatus.Valid;
        if (moment().isAfter(dto.endDate)) {
            status = ContractStatus.Expired;
        } else if (moment().isBefore(dto.startDate)) {
            status = ContractStatus.Upcoming;
        }

        const contract = OwnershipContract.create({
            startDate: convertToIsoString(dto.startDate),
            endDate: dto.endDate ? convertToIsoString(dto.endDate) : null,
            vehicle: foundVehicle,
            owner,
            status,
            reference: dto.reference,
        });

        return contract;
    }

    @Transactional()
    async checkOverlappingOwnership(vehicleId: number, startDate: string, endDate: string) {
        const [overlapping, overlapCount] = await OwnershipContract.checkOverlapping(vehicleId, startDate, endDate).getManyAndCount();
         // try to solve overlap
         if(overlapCount == 1)
         {
             await this.resolveOverlappingContractAutomatically(overlapping, vehicleId, startDate, endDate);
             return;
         }
        
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

    @Transactional()
    private async resolveOverlappingContractAutomatically(
        overlapping: Contract[],
        vehicleId: number,
        startDate: string,
        endDate?: string
    ): Promise<void> {
        // Perform simple logic for adjusting dates
        const overlappingContract = overlapping[0];
        const [existingStartDate, existingEndDate] = [moment(overlappingContract.startDate), moment(overlappingContract.endDate)];
        const [createStartDate, createEndDate] = [moment(startDate), moment(endDate)];
        // Handle the overlap where the existing end date gets adjusted to the start date
        if (
            existingStartDate.isBefore(createStartDate) &&
            existingEndDate.isAfter(createStartDate) &&
            existingEndDate.isBefore(createEndDate)
        ) {
            await this.updateContractService.updateContractDatesById(overlappingContract.contractId, {
                endDate: createStartDate.subtract(1, 'day').toISOString(),
            });
        } else {
            // We cant adjust otherwise
            throw new BadRequestException({
                message: ERROR_CODES.E038_ProvidedDatesOverlapWithExistingContract.message(),
                overlapping,
            });
        }   
    }
}
