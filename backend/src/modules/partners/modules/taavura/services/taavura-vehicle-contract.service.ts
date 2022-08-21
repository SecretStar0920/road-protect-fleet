import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract, Document, LeaseContract, OwnershipContract, Vehicle } from '@entities';
import { Dictionary, includes, isEmpty, mapValues, isEqual, get } from 'lodash';
import { CreateVehicleService } from '@modules/vehicle/services/create-vehicle.service';
import { CreateLeaseContractService } from '@modules/contract/modules/lease-contract/services/create-lease-contract.service';
import { UpdateContractService } from '@modules/contract/services/update-contract.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { GetVehicleService } from '@modules/vehicle/services/get-vehicle.service';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import {
    TaavuraVehicleContractDto,
    VehicleContractIntent,
} from '@modules/partners/modules/taavura/controllers/taavura-vehicle-contract.dto';
import { validate } from 'class-validator';
import { validatorExceptionFactoryStringArray } from '@modules/shared/helpers/validator-exception-factory.helper';
import { CreateVehicleDto } from '@modules/vehicle/controllers/create-vehicle.dto';
import { plainToClass } from 'class-transformer';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/controllers/lease-contract.controller';
import { CreateOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract.service';
import * as moment from 'moment';
import { CreateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/controllers/create-ownership-contract.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export interface ITaavuraVehicleContractResponseData {
    vehicle: Vehicle;
    lease?: LeaseContract;
    ownership?: OwnershipContract;
}

export interface ITaavuraVehicleContractResponse {
    message: string;
    actionPerformed: VehicleContractIntent;
    data: ITaavuraVehicleContractResponseData;
}

/**
 * Use this to avoid reference conflict between customers
 */
export enum TaavuraContractReferencePrefix {
    Lease = 'taavura-lease-',
    Ownership = 'taavura-ownership-',
}

export const TAAVURA_BRN = '512562422';

@Injectable()
export class TaavuraVehicleContractService {
    constructor(
        private logger: Logger,
        private createVehicleService: CreateVehicleService,
        private createLeaseContractService: CreateLeaseContractService,
        private createOwnershipContractService: CreateOwnershipContractService,
        private updateContractService: UpdateContractService,
        private getVehicleService: GetVehicleService,
        private createDocumentService: CreateDocumentService,
    ) {}

    @Transactional()
    async vehicleContractCreateOrUpdate(dto: TaavuraVehicleContractDto): Promise<ITaavuraVehicleContractResponse> {
        // 1. Validate request against intention groups we expect (see Dto for more details)
        const intentionValidations = await this.validateIntentions(dto);

        // 2. Determine intention and throw if no intention could be found
        const intention = await this.determineIntention(intentionValidations, dto);
        if (intention === VehicleContractIntent.None) {
            throw new BadRequestException({
                message: ERROR_CODES.E097_TaavuraNoValidIntent.message(),
                detail: intentionValidations,
            });
        }
        // 3. Based on intention, perform logic
        const responseData = await this.performVehicleContractIntention(intention, dto);

        // 4. Return response
        return { message: 'Request successful', actionPerformed: intention, data: responseData };
    }

    @Transactional()
    private async performVehicleContractIntention(
        intention: VehicleContractIntent,
        dto: TaavuraVehicleContractDto,
    ): Promise<ITaavuraVehicleContractResponseData> {
        const toReturn: ITaavuraVehicleContractResponseData = {
            vehicle: null,
            lease: null,
            ownership: null,
        };

        const intents = VehicleContractIntent; // Alias to shorten reading length

        // 1. All requests expect a vehicle, create / update the vehicle
        if (
            includes(
                [intents.VehicleLeaseAndOwnership, intents.VehicleOwnershipReturn, intents.VehicleLease, intents.VehicleOwnership],
                intention,
            )
        ) {
            await this.upsertVehicle(dto, toReturn);
        }

        // 2. If Lease or combined: upsert Lease
        if (includes([intents.VehicleLeaseAndOwnership, intents.VehicleLease], intention)) {
            await this.upsertLeaseContract(dto, toReturn);
        }

        // 3. If ownership, combined or fringe combined: upsert ownership
        if (includes([intents.VehicleLeaseAndOwnership, intents.VehicleOwnership], intention)) {
            await this.upsertOwnershipContract(dto, toReturn);
        }

        // 4. Vehicle ownership return to Taavura
        if (includes([intents.VehicleOwnershipReturn], intention)) {
            this.logger.warn({
                message: 'Identical BRN detected, not making any changes at this point',
                detail: { dto, intention },
                fn: this.performVehicleContractIntention.name,
            });
            // throw new NotImplementedException({ message: 'Identical BRN detected, this case is currently under implementation with new understanding' });
            // await this.upsertOwnershipContract(dto, toReturn); // FIXME: Probably logic changes
        }

        // Update vehicle fully
        toReturn.vehicle = await this.getVehicleService.getVehicle(toReturn.vehicle.vehicleId);
        return toReturn;
    }

    @Transactional()
    private async upsertVehicle(dto: TaavuraVehicleContractDto, toReturn: ITaavuraVehicleContractResponseData): Promise<void> {
        let createVehicleDto: CreateVehicleDto = {
            registration: dto.veh_id,
            manufacturer: dto.veh_vendor,
            category: dto.veh_category,
            color: dto.veh_color,
            model: dto.veh_model,
            modelYear: dto.veh_year,
            weight: dto.veh_weight,
        };
        createVehicleDto = plainToClass(CreateVehicleDto, createVehicleDto);
        toReturn.vehicle = await this.createVehicleService.createVehicle(createVehicleDto);
    }

    @Transactional()
    private async upsertLeaseContract(dto: TaavuraVehicleContractDto, toReturn: ITaavuraVehicleContractResponseData): Promise<void> {
        const document = await this.saveLeaseContractPdf(dto.contract_string);

        const taavuraLeaseId: string = TaavuraContractReferencePrefix.Lease + dto.contract_update_id;
        // Check if exists first
        const existingLeaseContract = await LeaseContract.findByReference(taavuraLeaseId).getOne();
        if (existingLeaseContract) {
            // If it does exist, remove it and recreate it (safer update)
            await LeaseContract.remove(existingLeaseContract);
        }

        let createLeaseContractDto: CreateLeaseContractDto = {
            vehicle: toReturn.vehicle.registration,
            owner: dto.veh_owner_id,
            user: dto.veh_end_cust_id,
            reference: taavuraLeaseId,
            startDate: dto.veh_end_cust_start,
            endDate: dto.veh_end_cust_end,
            document: get(document, 'documentId', null) || get(existingLeaseContract, 'document.documentId', null) || null,
        };
        createLeaseContractDto = plainToClass(CreateLeaseContractDto, createLeaseContractDto);

        const overlapping = await LeaseContract.checkOverlapping(
            toReturn.vehicle.vehicleId,
            createLeaseContractDto.startDate,
            createLeaseContractDto.endDate,
        ).getMany();
        await this.resolveOverlappingContractAutomatically(overlapping, createLeaseContractDto);
        // Create
        toReturn.lease = await this.createLeaseContractService.createContractAndLinkInfringements(createLeaseContractDto);
    }

    @Transactional()
    private async upsertOwnershipContract(dto: TaavuraVehicleContractDto, toReturn: ITaavuraVehicleContractResponseData): Promise<void> {
        const taavuraOwnerContractId: string = TaavuraContractReferencePrefix.Ownership + dto.owner_update_id;
        // Check if exists first
        const existingOwnershipContract = await OwnershipContract.findByReference(taavuraOwnerContractId).getOne();
        if (existingOwnershipContract) {
            // If it does exist, remove it and recreate it (safer update)
            await OwnershipContract.remove(existingOwnershipContract);
        }

        let createOwnershipContractDto: CreateOwnershipContractDto = {
            vehicle: toReturn.vehicle.registration,
            owner: dto.veh_owner_id,
            reference: taavuraOwnerContractId,
            startDate: dto.veh_owner_start,
            endDate: dto.veh_owner_end,
        };
        createOwnershipContractDto = plainToClass(CreateOwnershipContractDto, createOwnershipContractDto);
        const overlapping = await OwnershipContract.checkOverlapping(
            toReturn.vehicle.vehicleId,
            createOwnershipContractDto.startDate,
            createOwnershipContractDto.endDate,
        ).getMany();
        await this.resolveOverlappingContractAutomatically(overlapping, createOwnershipContractDto);
        // Create
        toReturn.ownership = await this.createOwnershipContractService.createOwnershipContractAndLinkInfringements(
            createOwnershipContractDto,
        );
    }

    @Transactional()
    private async resolveOverlappingContractAutomatically(
        overlapping: Contract[],
        datesDto: { startDate: string; endDate?: string },
    ): Promise<void> {
        if (overlapping.length > 1) {
            // Can't resolve multiple overlaps automatically
            throw new BadRequestException({
                message: ERROR_CODES.E038_ProvidedDatesOverlapWithExistingContract.message(),
                overlapping,
            });
        } else if (overlapping.length === 1) {
            // Perform simple logic for adjusting dates
            const overlappingContract = overlapping[0];
            const [existingStartDate, existingEndDate] = [moment(overlappingContract.startDate), moment(overlappingContract.endDate)];
            const [createStartDate, createEndDate] = [moment(datesDto.startDate), moment(datesDto.endDate)];
            // Handle the overlap where the existing end date gets adjusted to the start date
            if (
                existingStartDate.isBefore(createStartDate) &&
                existingEndDate.isAfter(createStartDate) &&
                existingEndDate.isBefore(createEndDate)
            ) {
                await this.updateContractService.updateContractDatesById(overlappingContract.contractId, {
                    endDate: createStartDate.subtract(1, 'second').toISOString(),
                });
            } else {
                // We cant adjust otherwise
                throw new BadRequestException({
                    message: ERROR_CODES.E098_TaavuraCannotHandleOverlapCriteria.message(),
                    overlapping,
                });
            }
        }
    }

    @Transactional()
    async validateIntentions(dto: TaavuraVehicleContractDto): Promise<Dictionary<{ valid: boolean; validationErrors: string[] }>> {
        const validationResults = {
            [VehicleContractIntent.VehicleLease]: validatorExceptionFactoryStringArray(
                await validate(dto, { groups: [VehicleContractIntent.VehicleLease] }),
            ),
            [VehicleContractIntent.VehicleOwnership]: validatorExceptionFactoryStringArray(
                await validate(dto, { groups: [VehicleContractIntent.VehicleOwnership] }),
            ),
            [VehicleContractIntent.VehicleLeaseAndOwnership]: validatorExceptionFactoryStringArray(
                await validate(dto, { groups: [VehicleContractIntent.VehicleLeaseAndOwnership] }),
            ),
        };

        return mapValues(validationResults, (val) => {
            return {
                valid: val.length === 0,
                validationErrors: val,
            };
        });
    }

    @Transactional()
    determineIntention(
        intentionValidations: Dictionary<{ valid: boolean; validationErrors: string[] }>,
        dto: TaavuraVehicleContractDto,
    ): VehicleContractIntent {
        if (intentionValidations[VehicleContractIntent.VehicleLeaseAndOwnership].valid) {
            // NOTE: Validation is identical for two intents here, as such we perform additional
            // logic on the data to determine the real intent. The determining factor
            // is whether or not the two BRN fields are identical
            const identicalUserOwnerBRN = isEqual(dto.veh_end_cust_id, dto.veh_owner_id);
            if (!identicalUserOwnerBRN) {
                // Case 1: Lease and Ownership
                return VehicleContractIntent.VehicleLeaseAndOwnership;
            } else if (identicalUserOwnerBRN) {
                if (dto.veh_end_cust_id !== TAAVURA_BRN) {
                    throw new BadRequestException({
                        message: ERROR_CODES.E099_TaavuraIdenticalIdsForUserAndOwner.message(),
                        detail: { requestData: dto },
                    });
                }
                // Case 2: Owner & User BRN is identical, Taavura expects this to indicate a return of the vehicle to the owner
                return VehicleContractIntent.VehicleOwnershipReturn;
            }
        } else if (intentionValidations[VehicleContractIntent.VehicleLease].valid) {
            return VehicleContractIntent.VehicleLease;
        } else if (intentionValidations[VehicleContractIntent.VehicleOwnership].valid) {
            return VehicleContractIntent.VehicleOwnership;
        } else {
            return VehicleContractIntent.None;
        }
    }

    /**
     * Creates a document from the base64 contract string if it exists
     */
    @Transactional()
    async saveLeaseContractPdf(contractString: string): Promise<Document> {
        if (isEmpty(contractString)) {
            return null;
        }
        const fileBuffer = new Buffer(contractString, 'base64');
        return await this.createDocumentService.saveDocumentFileAndCreate(
            { fileName: 'taavura-lease-contract.pdf', fileDirectory: 'documents' },
            fileBuffer,
        );
    }
}
