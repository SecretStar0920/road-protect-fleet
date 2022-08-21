import { Infringement, InfringementStatus } from '@entities';
import { cloneDeep, includes, isNil, some } from 'lodash';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { Logger } from '@logger';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { IStatusCombination } from '@modules/infringement/helpers/status-mapper/interfaces/status-combination.type';
import { IIsValidStatusTransition } from '@modules/infringement/helpers/status-mapper/interfaces/is-valid-status-transition.type';
import { validStatusTransitions } from '@modules/infringement/helpers/status-mapper/config/valid-status-transitions';
import { IssuerStatusMap } from '@modules/infringement/helpers/status-mapper/config/issuer-status-map';
import { StatusCombinations } from '@modules/infringement/helpers/status-mapper/config/status-combinations';
import { forcedStatusSyncs } from '@modules/infringement/helpers/status-mapper/config/forced-status-syncs';
import { NominationStatus } from '@modules/shared/models/nomination-status';

//////////////////////////////////////////////////////////////////
// V2
// Set both infringement and nomination status independent of each other
// Also includes rules for possible update transitions for both infringement and nomination statuses
//////////////////////////////////////////////////////////////////

export class StatusMapper {
    logger = Logger.instance;
    constants = {
        PAID_AMOUNT_DUE: 0, // if amountDue is less than this, the infringement gets set as PAID [ Double check, why 20? ]
        APPLICABLE_KEYS: ['amountDue', 'issuerStatus', 'originalAmount'], // If any of these keys are in the dto, the status check should occur
        OVERRIDE_KEYS: ['nominationStatus', 'infringementStatus'], // If any of these keys are in the dto, the status check should occur
    };

    /**
     * Checks to see if the next transition is valid by checking what the
     * current transition is and where it wants to go to next. If the current
     * status is null then anything is valid otherwise we refer to the config
     * to see if the next status is okay
     * @param current The current status that the infringement is on
     * @param next The next status that the infringement is going to
     */
    isValidInfringementStatusTransition(
        current: InfringementStatus,
        next: InfringementStatus,
    ): IIsValidStatusTransition<InfringementStatus> {
        if (isNil(current)) {
            return { isValid: true, options: Object.values(InfringementStatus), current, next };
        }
        const options = validStatusTransitions.infringement[current] || [];
        const isValid = some(options, (val) => val === next) || current === next;
        return { isValid, options, current, next };
    }

    /**
     * Checks to see if the next nomination status is valid given the value of
     * the current nomination status. If the current status is null then any
     * status is okay, otherwise we refer to the config to see if the next
     * transition is okay.
     * @param current The current status
     * @param next The status we'd like to move to
     */
    isValidNominationStatusTransition(current: NominationStatus, next: NominationStatus): IIsValidStatusTransition<NominationStatus> {
        if (isNil(current)) {
            return { isValid: true, options: Object.values(NominationStatus), current, next };
        }
        const options = validStatusTransitions.nomination[current] || [];
        const isValid = some(options, (val) => val === next) || current === next;
        return { isValid, options, current, next };
    }

    /**
     * Checks whether the dto (for create or update)
     * includes any changes in keys which might induce a status update
     */
    canInferStatus(dto: any) {
        const dtoKeys = Object.keys(omitNull(dto));
        const keysToCheck = this.constants.APPLICABLE_KEYS;

        return includes(
            dtoKeys.map((key) => {
                return includes(keysToCheck, key);
            }),
            true,
        );
    }

    /**
     * Checks whether the dto (for create or update)
     * includes manual status update keys to override normal status update logic
     */
    canOverrideStatus(dto: any) {
        const dtoKeys = Object.keys(omitNull(dto));
        const keysToCheck = this.constants.OVERRIDE_KEYS;

        return includes(
            dtoKeys.map((key) => {
                return includes(keysToCheck, key);
            }),
            true,
        );
    }

    /**
     * @param dto The dto coming in, we use this to pull information around
     * the current job being performed
     * @param initialStatusCombination What the initial status has been determined to be.
     * @param initialInfringement The infringement that was sent in at the start
     * @param canOverrideStatus Whether we are allowing the status to be overwritten, this
     * flag allows us to ignore what the transition should be and lets us write what we
     * need it to be. This is usually used when we're trying to fix a status or allow
     * administrative users to perform tasks that the system wouldn't usually allow them
     * to do.
     *
     * ** DESIGN DECISION **
     * When originally looking at this problem, we wanted the core functionality to still
     * apply when updating the status but sometimes we wanted to force the status change.
     * For instance, if we want to change something from paid to due, we still want the
     * redirection logic and other logic to follow. I decided that the easiest and least
     * intrusive approach would be to add a flag that defaults to false on this status
     * updater level and if we set it to true then it'll ignore the status rules but perform
     * the rest of the logic.
     */
    resolveStatusCombination(
        dto: any,
        initialStatusCombination: IStatusCombination,
        initialInfringement: Infringement,
        canOverrideStatus: boolean = false,
    ) {
        initialStatusCombination = cloneDeep(initialStatusCombination);
        // If manual status update, ignore the other rules and override status rules
        if (canOverrideStatus && this.canOverrideStatus(dto)) {
            const statusCombination: IStatusCombination = initialStatusCombination;
            if (!!dto.nominationStatus) {
                statusCombination.nomination = dto.nominationStatus;
            }
            if (!!dto.infringementStatus) {
                statusCombination.infringement = dto.infringementStatus;
            }
            return statusCombination;
        }

        if (!this.canInferStatus(dto)) {
            this.logger.debug({
                message: 'No field updates that would require a re-look at the status data',
                detail: dto,
                fn: this.resolveStatusCombination.name,
            });
            return initialStatusCombination;
        }

        // Status rules based on issuer status
        const issuerStatusCombination: IStatusCombination = this.inferStatusFromIssuerStatus(dto);

        // Status rules based on data as opposed to issuer status
        const rulesStatusCombination: IStatusCombination = this.inferStatusFromDataRules(initialInfringement, dto);

        // Resolve how to choose the correct statuses based on the data provided
        return this.mergeStatusCombinations(
            cloneDeep(initialStatusCombination),
            cloneDeep(issuerStatusCombination),
            cloneDeep(rulesStatusCombination),
        );
    }

    /**
     * Retrieves the status combination that can be "guessed" given the Hebrew
     * statuses that have come in.
     * @param dto The infringement DTO that is modifying/creating the
     * infringement
     * @param initialInfringement If this is an update then we specify the
     * initial infringement
     * @private
     */
    private inferStatusFromIssuerStatus(dto: Partial<CreateInfringementDto | UpdateInfringementDto>, initialInfringement?: Infringement) {
        // NB: if the issuer status is the same as the current stored issuer status, return nothing
        if (!!initialInfringement && initialInfringement.issuerStatus === dto.issuerStatus) {
            return null;
        }

        const issuerStatusCombination: IStatusCombination = IssuerStatusMap.get[dto.issuerStatus];
        if (isNil(issuerStatusCombination)) {
            this.logger.warn({ message: 'Issuer status not handled', detail: { dto }, fn: this.inferStatusFromIssuerStatus.name });
        }
        return issuerStatusCombination;
    }

    /**
     * Based on a set of business rules, we may be able to determine what the
     * status should be. This function attempts to extract a status based on
     * these business rules.
     * @param initial The initial dto
     * @param changes The changes that are occurring
     */
    inferStatusFromDataRules(initial: Infringement, changes: any) {
        // Auto Pay Status based on amount due
        if (Number(changes.amountDue) === this.constants.PAID_AMOUNT_DUE) {
            this.logger.debug({
                message: 'Inferring infringement status is paid from amount due',
                detail: { changes },
                fn: this.inferStatusFromDataRules.name,
            });
            return StatusCombinations.get.paidFully;
        }

        // Removed logic to set outstanding status here as this is handled in the infringement schedule service

        return null;
    }

    private mergeStatusCombinations(
        initial: IStatusCombination,
        issuerStatusCombination: IStatusCombination,
        rulesStatusCombination: IStatusCombination,
    ) {
        // If neither an issuer status or data rule status exists, assume no changes
        if (isNil(issuerStatusCombination) && isNil(rulesStatusCombination)) {
            this.logger.warn({
                message: 'Could not gather a status from any data provided',
                detail: { issuerStatusCombination, rulesStatusCombination },
                fn: this.mergeStatusCombinations.name,
            });
            return initial; // Return initial
        }

        // There aren't many rules but they should take priority
        const newCombination = rulesStatusCombination || issuerStatusCombination;

        // BUT
        // If it WAS outstanding and the new rule says it should be Due, keep outstanding
        if (initial?.infringement === InfringementStatus.Outstanding && newCombination?.infringement === InfringementStatus.Due) {
            newCombination.infringement = InfringementStatus.Outstanding;
        }
        // If it is due and the new rule says it should be outstanding
        if (
            newCombination?.infringement === InfringementStatus.Due &&
            rulesStatusCombination?.infringement === InfringementStatus.Outstanding
        ) {
            newCombination.infringement = InfringementStatus.Outstanding;
        }

        if (initial?.nomination && !newCombination?.nomination) {
            newCombination.nomination = initial.nomination;
        }

        if (
            initial?.nomination === NominationStatus.InRedirectionProcess &&
            newCombination?.nomination !== NominationStatus.RedirectionCompleted
        ) {
            newCombination.nomination = NominationStatus.InRedirectionProcess;
        }

        /*
         * If infringement is currently approved for payment (infringement status) then don't move to due or outstanding.
         * Still allow to move to paid or closed.
         * */
        if (
            initial?.infringement === InfringementStatus.ApprovedForPayment &&
            (newCombination?.infringement === InfringementStatus.Due || newCombination?.infringement === InfringementStatus.Outstanding)
        ) {
            newCombination.infringement = initial.infringement;
        }

        // We always close a nomination if infringement has been resolved as paid or closed.
        if (forcedStatusSyncs[initial.infringement]) {
            newCombination.nomination = forcedStatusSyncs[newCombination.infringement];
        }

        return newCombination;
    }
}

export const statusMapper = new StatusMapper();
