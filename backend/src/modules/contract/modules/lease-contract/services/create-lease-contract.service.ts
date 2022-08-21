import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { CONTRACT_CONSTRAINTS, ContractStatus, Document, LeaseContract, Vehicle, Contract } from '@entities';
import * as moment from 'moment';
import { LinkingService } from '@modules/shared/services/linking.service';
import { isNil } from 'lodash';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/controllers/lease-contract.controller';
import { CreateContractService } from '@modules/contract/services/create-contract.service';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { convertToIsoString } from '@modules/shared/helpers/timezone-conversion';
import { FindExistingLeaseContractService } from '@modules/contract/modules/lease-contract/services/find-existing-lease-contract.service';
import { UpdateLeaseContractService } from '@modules/contract/modules/lease-contract/services/update-lease-contract.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { ContractOcrStatusService } from '@modules/contract/services/contract-ocr-status.service';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';


@Injectable()
export class CreateLeaseContractService extends CreateContractService {
    constructor(
        protected logger: Logger,
        protected linkingService: LinkingService,
        private findExistingLeaseContractService: FindExistingLeaseContractService,
        private contractOcrStatusService: ContractOcrStatusService,
        private updateLeaseContractService: UpdateLeaseContractService,
        private updateContractService: UpdateContractService,
        ) {
        super(logger, linkingService);
    }

    @Transactional()
    async upsertContractAndLinkInfringements(dto: CreateLeaseContractDto): Promise<LeaseContract> {
        const found = await this.findExistingLeaseContractService.find(dto.vehicle, dto.owner, dto.user, dto.startDate, dto.endDate);
        if (found) {
            this.logger.warn({
                message: `A user is trying to create an ownership contract that already exists`,
                detail: dto,
                fn: this.upsertContractAndLinkInfringements.name,
            });
            return await this.updateLeaseContractService.updateLeaseContractMetadata(found.contractId, {
                document: dto.document,
                reference: dto.reference,
            });
        }
        return this.createContractAndLinkInfringements(dto);
    }

    @Transactional()
    async createContractAndLinkInfringements(dto: CreateLeaseContractDto): Promise<LeaseContract> {
        this.logger.debug({ message: 'Creating Vehicle Lease Contract', detail: dto, fn: this.createContractAndLinkInfringements.name });

        let contract = await this.createOnly(dto);
        const document = await this.checkDocumentRelation(dto.document);
        try {
            if (!isNil(document)) {
                contract.document = document;
            }
            contract = await contract.save();
            // Check OCR status
            await this.contractOcrStatusService.setOcrStatus(contract.contractId);
        } catch (e) {
            databaseExceptionHelper(e, CONTRACT_CONSTRAINTS, 'Failed to create lease contract, please contact the developers.');
        }

        await this.linkingService.relinkContractInfringements(contract);
        await this.linkingService.relinkVehicleContracts(contract.vehicle);

        this.logger.debug({
            message: 'Created Vehicle Lease Contract',
            detail: contract.contractId,
            fn: this.createContractAndLinkInfringements.name,
        });
        return contract;
    }

    @Transactional()
    async createOnly(dto: CreateLeaseContractDto, vehicle?: Vehicle) {
        const user = await this.checkAccountRelations(dto.user);
        const owner = await this.checkAccountRelations(dto.owner);

        const foundVehicle = vehicle ? vehicle : await this.checkVehicleRelation(dto.vehicle);

        // Check overlapping (not entirely necessary since we have database exclusion check
        await this.checkOverlappingLease(foundVehicle.vehicleId, dto.startDate, dto.endDate);

        let status = ContractStatus.Valid;
        if (moment().isAfter(dto.endDate)) {
            status = ContractStatus.Expired;
        } else if (moment().isBefore(dto.startDate)) {
            status = ContractStatus.Upcoming;
        }

        const contract = LeaseContract.create({
            startDate: convertToIsoString(dto.startDate),
            endDate: dto.endDate ? convertToIsoString(dto.endDate) : null,
            vehicle: foundVehicle,
            user,
            owner,
            status,
            reference: dto.reference,
        });

        return contract;
    }

    async checkDocumentOCR(document: Document, contract: LeaseContract) {
        if (
            document.ocr.car !== contract.vehicle.registration ||
            !moment(document.ocr.start).endOf('day').isSame(moment(contract.startDate).endOf('day')) ||
            !moment(document.ocr.end).endOf('day').isSame(moment(contract.endDate).endOf('day')) ||
            document.ocr.owner !== contract.owner.identifier ||
            document.ocr.customer !== contract.user.identifier
        ) {
            this.logger.debug({
                message: 'Document details do not match the contract details',
                detail: { document, contract },
                fn: this.createContractAndLinkInfringements.name,
            });
            throw new BadRequestException({
                message: ERROR_CODES.E036_DocumentDetailsDontMatchContract.message(),
            });
        }
    }

    @Transactional()
    async checkOverlappingLease(vehicleId: number, startDate: string, endDate: string) {
        const [overlapping, overlapCount] = await LeaseContract.checkOverlapping(vehicleId, startDate, endDate).getManyAndCount();
        
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
