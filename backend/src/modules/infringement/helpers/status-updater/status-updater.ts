import { Infringement, Nomination } from '@entities';
import { Logger } from '@logger';
import { StatusCombinations } from '@modules/infringement/helpers/status-mapper/config/status-combinations';
import { IStatusCombination } from '@modules/infringement/helpers/status-mapper/interfaces/status-combination.type';
import { StatusMapper } from '@modules/infringement/helpers/status-mapper/status-mapper';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { BadRequestException } from '@nestjs/common';
import { cloneDeep, isNil } from 'lodash';
import { Transactional } from 'typeorm-transactional-cls-hooked';

/**
 * The idea of this class is to create a context in any process that might cause a change in infringement or nomination status
 * that is passed throughout the whole flow to assist in:
 * 1) Correctly setting/resolving the infringement and nomination status
 * 2) Detecting invalid status combinations or transitions
 * 3) Creating status logs (LATER)
 */
export class StatusUpdater {
    private source: StatusUpdateSources;
    private dto: any;

    private initialInfringement: Infringement;
    private initialNomination: Nomination;
    private finalInfringement: Infringement;
    private finalNomination: Nomination;

    private statusMapper = new StatusMapper();
    private logger = Logger.instance;

    private forcedIssuerStatus: string;

    /**
     * Final, system decided status change after flow and all nested changes have been completed
     */
    proposedStatusChange: Partial<IStatusCombination> = {};

    static create() {
        return new StatusUpdater();
    }

    /**
     * TODO: I'm not sure if the responsibility of returning the latest data
     *  should be in this class. It seems that the name of the class and what I
     *  am asking it to do now clash. So we may want to refactor this a bit.
     */

    /**
     * Returns the latest nomination if it exists on the updater
     */
    getLatestNomination() {
        return this.finalNomination || this.initialNomination || this.finalInfringement?.nomination || this.initialInfringement?.nomination;
    }

    /**
     * Returns the latest infringement if it exists on the updater
     */
    getLatestInfringement() {
        return (
            this.finalInfringement || this.initialInfringement || this.finalNomination?.infringement || this.initialNomination?.infringement
        );
    }

    setSource(source: StatusUpdateSources): this {
        this.source = source;
        return this;
    }

    setDto(dto: any): this {
        this.dto = dto;
        return this;
    }

    setInitialInfringement(infringement: Infringement): this {
        this.initialInfringement = infringement;
        return this;
    }

    setInitialNomination(nomination: Nomination): this {
        this.initialNomination = nomination;
        return this;
    }

    setFinalInfringement(infringement: Infringement): this {
        this.finalInfringement = infringement;
        return this;
    }

    setFinalNomination(nomination: Nomination): this {
        this.finalNomination = nomination;
        return this;
    }

    /**
     * In some instances, we want to force a specific status because our
     * logic requires it and it didn't come in with the information needed
     * to make a decision at that point.
     * @param issuerStatus The status we would like to force
     */
    setForceIssuerStatus(issuerStatus: string): this {
        this.forcedIssuerStatus = issuerStatus;
        return this;
    }

    logInfo(): this {
        this.logger.debug({
            message: `Status Updater Information from: [${this.source}]`,
            detail: {
                STATUS_COMBINATIONS: {
                    initial: this.getInitialStatusCombination(),
                    final: this.getFinalStatusCombination(),
                    proposed: this.proposedStatusChange,
                },
                dto: this.dto,
                infringementId: (this.initialInfringement || this.finalInfringement || {}).infringementId,
                nominationId: (this.initialNomination || this.finalNomination || {}).nominationId,
            },
            fn: this.logInfo.name,
        });
        return this;
    }

    /**
     * Given everything known (initial states, final states, method, dto)
     * this method attempts to propose the most accurate status change
     * To persist the change, call the persist method
     */
    resolveStatusUpdates(canOverrideStatus: boolean = false): this {
        let dto = this.dto || {};
        if (this.forcedIssuerStatus) {
            dto = { ...dto, issuerStatus: this.forcedIssuerStatus };
        }
        // Based on the source we have slightly different logic
        if (this.source === StatusUpdateSources.CreateInfringement) {
            this.proposedStatusChange = this.statusMapper.resolveStatusCombination(
                dto,
                StatusCombinations.get.defaultNew,
                this.initialInfringement,
            );
        } else if (this.source === StatusUpdateSources.UpdateInfringement) {
            // We need to resolve any update conflicts to do with nomination status changes as a result of redirection
            this.proposedStatusChange = this.statusMapper.resolveStatusCombination(
                dto,
                this.getInitialStatusCombination(),
                this.initialInfringement,
                canOverrideStatus,
            );
        } else if (this.source === StatusUpdateSources.ContractUpdate) {
            // Nothing to resolve in this case - managed by external code
        } else if (this.source === StatusUpdateSources.InternalProcess) {
            // Nothing to resolve in this case - managed by external code
        }

        return this;
    }

    /**
     * Checks the proposed status change and throws an error if it is incorrect
     */
    throwIfInvalidStatusTransition(): this {
        // Check valid transitions
        if (!isNil(this.initialInfringement) && this.proposedStatusChange.infringement) {
            const isValidInfringementTransition = this.statusMapper.isValidInfringementStatusTransition(
                this.initialInfringement.status,
                this.proposedStatusChange.infringement,
            );
            if (!isValidInfringementTransition.isValid) {
                this.logger.error({
                    message: 'Invalid infringement status update from external',
                    detail: { isValidInfringementTransition, statusCombination: this.proposedStatusChange },
                    fn: this.throwIfInvalidStatusTransition.name,
                });
                throw new BadRequestException({
                    message: `Invalid infringement status update. Cannot go from ${isValidInfringementTransition.current} to ${isValidInfringementTransition.next}.`,
                    detail: { isValidInfringementTransition, statusCombination: this.proposedStatusChange },
                });
            }
        }

        // Nomination is not always available, early return in this case.
        if (!isNil(this.initialNomination) && this.proposedStatusChange.nomination) {
            const isValidNominationTransition = this.statusMapper.isValidNominationStatusTransition(
                this.initialNomination.status,
                this.proposedStatusChange.nomination,
            );
            if (!isValidNominationTransition.isValid) {
                this.logger.error({
                    message: 'Invalid nomination status update from external',
                    detail: { isValidNominationTransition, statusCombination: this.proposedStatusChange },
                    fn: this.throwIfInvalidStatusTransition.name,
                });
                throw new BadRequestException({
                    message: `Invalid nomination status update. Cannot go from ${isValidNominationTransition.current} to ${isValidNominationTransition.next}.`,
                    detail: { isValidNominationTransition, statusCombination: this.proposedStatusChange },
                });
            }
        }

        return this;
    }

    /**
     * Persists the proposed status change
     */
    @Transactional()
    async persist(): Promise<void> {
        this.logger.debug({
            message: 'Persisting infringement change',
            detail: {
                initialInfringement: this.initialInfringement,
                initialNomination: this.initialNomination,
                finalInfringement: this.finalInfringement,
                finalNomination: this.finalNomination,
            },
            fn: this.persist.name,
        });
        // If we have latest infringement and a proposed status change
        if (this.finalInfringement && this.proposedStatusChange.infringement) {
            this.finalInfringement.status = this.proposedStatusChange.infringement;
            this.logger.debug({
                message: 'Persisting final infringement',
                detail: {
                    infringement: this.finalInfringement,
                },
                fn: this.persist.name,
            });
            await this.finalInfringement.save();
        }
        // If we have latest nomination and a proposed status change
        if (this.finalNomination && this.proposedStatusChange.nomination) {
            this.finalNomination.status = this.proposedStatusChange.nomination;
            if (!this.finalNomination.infringement) {
                this.finalNomination.infringement = Infringement.create({
                    infringementId: (this.finalInfringement || this.initialInfringement).infringementId,
                });
            }
            this.logger.debug({
                message: 'Persisting final nomination',
                detail: {
                    nomination: this.finalNomination,
                },
                fn: this.persist.name,
            });
            await this.finalNomination.save();
        }
    }

    getInitialStatusCombination(): IStatusCombination {
        return {
            infringement: this.initialInfringement?.status,
            nomination: this.initialNomination?.status,
        };
    }

    getFinalStatusCombination(): IStatusCombination {
        return { infringement: this.finalInfringement?.status, nomination: this.finalNomination?.status };
    }
}
