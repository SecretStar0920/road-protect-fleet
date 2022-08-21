import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract, Infringement, InfringementSystemStatus, LeaseContract, OwnershipContract, Vehicle } from '@entities';
import { isEmpty, isNil } from 'lodash';
import * as moment from 'moment';
import { AutomaticNominationService } from '@modules/nomination/services/automatic-nomination.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { UpdateContractEndDateDto } from '@modules/contract/controllers/update-contract-end-date.dto';
import { Brackets } from 'typeorm';

export interface ChangesThatRequireRelink {
    // Means there was a redirection
    brn?: string;

    // The infringement could now fall under another contract
    offenceDate?: string;

    // The status could mean that a redirection has completed
    issuerStatus?: string;

    // An admin may be trying to set the identifier or an external
    // change has caused the identifier to change
    redirectionIdentifier?: string | number;

    // A redirection has completed
    dateRedirectionCompleted?: string;

    // The date that the redirection was initiated
    redirectionLetterSendDate?: string;

    // Whether the admin is trying to set the redirection identifier
    setRedirectionIdentifier?: boolean;
}

@Injectable()
/**
 * IMPORTANT LOGIC SERVICE, BE CAREFUL AROUND HERE
 * Contains all logic for linking and unlinking:
 * Infringements to contracts
 * Infringements to nominations
 * vehicles to contracts
 */
export class LinkingService {
    constructor(private logger: Logger, private automaticNominationService: AutomaticNominationService) {}

    public shouldRelink(dto: ChangesThatRequireRelink) {
        return (
            !isNil(dto.offenceDate) ||
            !isNil(dto.brn) ||
            !isNil(dto.issuerStatus) ||
            !isNil(dto.redirectionIdentifier) ||
            !isNil(dto.dateRedirectionCompleted) ||
            !isNil(dto.redirectionLetterSendDate) ||
            !isNil(dto.setRedirectionIdentifier)
        );
    }

    /**
     * Attempts to:
     * update all vehicles and their current contracts
     * update which contracts infringements link to
     */
    @Transactional()
    async relinkAll(): Promise<void> {
        const vehicles = await Vehicle.findWithMinimalRelations().getMany();
        const contracts = await Contract.findWithMinimalRelations().getMany();

        // // For each vehicle
        this.logger.log({ message: 'Relinking vehicle contracts: ', detail: vehicles.length, fn: this.relinkAll.name });
        let vehicleCount = 0;
        for (const vehicle of vehicles) {
            vehicleCount++;
            await this.relinkVehicleContracts(vehicle);
            this.logger.log({
                message: 'Relinked vehicle contract: ',
                detail: `${vehicleCount}/${vehicles.length}`,
                fn: this.relinkAll.name,
            });
        }
        // For each contract
        this.logger.log({ message: 'Relinking contract infringements: ', detail: `${contracts.length}`, fn: this.relinkAll.name });
        let contractCount = 0;
        for (const contract of contracts) {
            contractCount++;
            await this.relinkContractInfringements(contract);
            this.logger.log({
                message: 'Relinked contract infringement: ',
                detail: `${contractCount}/${contracts.length}`,
                fn: this.relinkAll.name,
            });
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    // CURRENT VEHICLE CONTRACTS
    //////////////////////////////////////////////////////////////////////////////////

    @Transactional()
    async relinkVehicleContracts(vehicle: Vehicle): Promise<void> {
        await this.clearCurrentContractsFromVehicle(vehicle);
        await this.setCurrentContractsForVehicle(vehicle);
    }

    @Transactional()
    async clearCurrentContractsFromVehicle(vehicle: Vehicle): Promise<void> {
        await Vehicle.update(vehicle.vehicleId, { currentOwnershipContract: null, currentLeaseContract: null });
    }

    @Transactional()
    async setCurrentContractsForVehicle(vehicle: Vehicle): Promise<void> {
        // Find current lease contract
        const foundLease = await LeaseContract.findByVehicleAndDate(vehicle.vehicleId, moment().toISOString()).getOne();
        // Find current ownership contract
        const foundOwnership = await OwnershipContract.findByVehicleAndDate(vehicle.vehicleId, moment().toISOString()).getOne();

        await Vehicle.update(vehicle.vehicleId, {
            currentLeaseContract: foundLease,
            currentOwnershipContract: foundOwnership,
        });
    }

    //////////////////////////////////////////////////////////////////////////////////
    // INFRINGEMENTS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * @param infringement The infringement to link
     * @param statusUpdater The status updater to set status etc
     * @param nominationDto Used if specific nomination fields should be carried through to the nomination
     */
    @Transactional()
    async linkInfringementContractAndResolveNomination(
        infringement: Infringement,
        statusUpdater: StatusUpdater,
        nominationDto: NominationDto = {},
    ): Promise<void> {
        // First unlink the contract and infringement
        await this.clearInfringementContract(infringement);
        // Then search for a new contract to link to the infringement
        await this.setInfringementContract(infringement);
        // Update the nomination too
        await this.automaticNominationService.nominateInfringement(infringement, statusUpdater, nominationDto);
    }

    @Transactional()
    async clearInfringementContract(infringement: Infringement): Promise<void> {
        await Infringement.update(infringement.infringementId, { contract: null });
    }

    @Transactional()
    async setInfringementContract(infringement: Infringement): Promise<void> {
        this.logger.log({ message: 'Finding valid contract for infringement', fn: this.setInfringementContract.name });
        // Check for a lease
        const foundLease = await LeaseContract.findByVehicleAndDate(infringement.vehicle.vehicleId, infringement.offenceDate).getOne();

        // Check for an ownership contract otherwise
        const foundOwnership = await OwnershipContract.findByVehicleAndDate(
            infringement.vehicle.vehicleId,
            infringement.offenceDate,
        ).getOne();

        if (!isNil(foundLease)) {
            infringement.contract = foundLease;
            await Infringement.update(infringement.infringementId, {
                contract: foundLease,
                systemStatus: InfringementSystemStatus.Valid,
            });
            this.logger.log({
                message: `Set valid contract for infringement ${infringement.infringementId} to a lease contract`,
                fn: this.setInfringementContract.name,
            });
        } else if (!isNil(foundOwnership)) {
            infringement.contract = foundOwnership;

            await Infringement.update(infringement.infringementId, {
                contract: foundOwnership,
                systemStatus: InfringementSystemStatus.Valid,
            });
            this.logger.log({
                message: `Set valid contract for infringement ${infringement.infringementId} to an ownership contract`,
                fn: this.setInfringementContract.name,
            });
        } else {
            this.logger.warn({
                message: `No contract found for infringement: ${infringement.infringementId}`,
                fn: this.setInfringementContract.name,
            });
            await Infringement.update(infringement.infringementId, { systemStatus: InfringementSystemStatus.MissingContract });
        }
    }

    //////////////////////////////////////////////////////////////////////////////////
    // CONTRACTS AND INFRINGEMENTS
    //////////////////////////////////////////////////////////////////////////////////

    @Transactional()
    async relinkContractInfringements(contract: Contract, oldDates?: UpdateContractEndDateDto): Promise<void> {
        await this.clearContractInfringements(contract);
        await this.setContractInfringements(contract, oldDates);
    }

    @Transactional()
    private async clearContractInfringements(contract: Contract): Promise<void> {
        // Unlink ALL infringements from the contract
        const oldInfringements = await Infringement.findWithMinimalRelations()
            .andWhere('infringementContract.contractId = :id', { id: contract.contractId })
            .getMany();

        if (!isEmpty(oldInfringements)) {
            this.logger.debug({
                message: 'Found infringements to unlink for the given contract',
                detail: oldInfringements.length,
                fn: this.relinkContractInfringements.name,
            });
            try {
                await Infringement.update(
                    oldInfringements.map((i) => i.infringementId),
                    { contract: null },
                );
            } catch (e) {
                this.logger.error({
                    message: 'Failed to unlink infringements',
                    detail: {
                        error: e.message,
                        stack: e.stack,
                    },
                    fn: this.relinkContractInfringements.name,
                });
            }
        }
    }

    @Transactional()
    private async setContractInfringements(contract: Contract, oldDates?: UpdateContractEndDateDto): Promise<void> {
        const newInfringementsQuery = Infringement.findWithMinimalRelations().andWhere('vehicle.vehicleId = :vehicleId', {
            vehicleId: contract.vehicle.vehicleId,
        });

        if (oldDates) {
            newInfringementsQuery.andWhere(
                new Brackets((qb) => {
                    const earliestStartDate = moment(contract.startDate).isSameOrBefore(moment(oldDates.startDate))
                        ? moment(contract.startDate).toISOString()
                        : moment(oldDates.startDate).toISOString();
                    const latestEndDate = moment(contract.endDate).isSameOrAfter(moment(oldDates.endDate))
                        ? moment(contract.endDate).toISOString()
                        : moment(oldDates.endDate).toISOString();
                    qb.andWhere(`tstzrange(:startDate, :endDate, '[]') @> infringement.offenceDate`, {
                        startDate: earliestStartDate,
                        endDate: latestEndDate,
                    });
                }),
            );
        } else {
            newInfringementsQuery.andWhere(`tstzrange(:startDate, :endDate, '[]') @> infringement.offenceDate`, {
                startDate: contract.startDate,
                endDate: contract.endDate,
            });
        }

        const newInfringements = await newInfringementsQuery.getMany();

        // Link new infringements
        if (!isEmpty(newInfringements)) {
            this.logger.debug({
                message: 'Found infringements to link for the given contract',
                detail: newInfringements.length,
                fn: this.relinkContractInfringements.name,
            });
            try {
                for (const infringement of newInfringements) {
                    const statusUpdater = StatusUpdater.create()
                        .setSource(StatusUpdateSources.ContractUpdate)
                        .setInitialInfringement(infringement)
                        .setInitialNomination(infringement.nomination);
                    // Ask the infringement to link to the correct contract since we have an ownership and lease contract possibly
                    await this.linkInfringementContractAndResolveNomination(infringement, statusUpdater);
                    await statusUpdater.resolveStatusUpdates().persist();
                }
            } catch (e) {
                this.logger.error({
                    message: 'Failed to link infringements',
                    detail: {
                        error: e.message,
                        stack: e.stack,
                    },
                    fn: this.relinkContractInfringements.name,
                });
            }
        }
    }
}
