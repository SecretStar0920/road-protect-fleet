import { LeaseContract, Nomination, NominationType, RedirectionType, User } from '@entities';
import { Logger } from '@logger';
import { BatchMunicipalRedirectionDto } from '@modules/nomination/dtos/batch-municipal-redirection.dto';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { GetRedirectionDetailsService } from '@modules/nomination/services/get-redirection-details.service';
import { AutomationRedirectionService } from '@modules/nomination/services/redirection/automation-redirection.service';
import { ManualRedirectionService } from '@modules/nomination/services/redirection/manual-redirection.service';
import { TelavivRedirectionService } from '@modules/nomination/services/redirection/telaviv-redirection.service';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { includes, isNil } from 'lodash';
import * as moment from 'moment';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { v4 } from 'uuid';
import { JerusalemRedirectionService } from '@modules/nomination/services/redirection/jerusalem-redirection.service';
import { PoliceRedirectionService } from '@modules/nomination/services/redirection/police-redirection.service';
import { IssuerChannels } from '@modules/shared/models/issuer-integration-details.model';
import { SystemUserManualRedirectionService } from '@modules/nomination/services/redirection/system-user-manual-redirection.service';
import { MileonRedirectionService } from '@modules/nomination/services/redirection/mileon-redirection.service';
import { MetroparkRedirectionService } from '@modules/nomination/services/redirection/metropark-redirection.service';
import { KfarSabaRedirectionService } from '@modules/nomination/services/redirection/kfarSaba-redirection.service';
import { City4uRedirectionService } from '@modules/nomination/services/redirection/city4u-redirection.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessfulRedirectionResult {
    @ApiProperty({ type: 'object', description: 'Nomination' })
    result: Nomination;
    @ApiProperty()
    nominationId: number;
}

export class FailedRedirectionResult {
    @ApiProperty()
    error: any;
    @ApiProperty()
    nominationId: number;
    @ApiProperty({ type: 'object', description: 'Nomination' })
    result: Nomination;
}

export class BatchRedirectionsResult {
    @ApiProperty({ type: () => SuccessfulRedirectionResult })
    successfulRedirections: SuccessfulRedirectionResult[];
    @ApiProperty({ type: () => FailedRedirectionResult })
    failedRedirections: FailedRedirectionResult[];
}
@Injectable()
export class MunicipallyRedirectNominationService {
    constructor(
        private logger: Logger,
        private getRedirectionDetailsService: GetRedirectionDetailsService,
        private manualRedirectionService: ManualRedirectionService,
        private automationRedirectionService: AutomationRedirectionService,
        private telavivRedirectionService: TelavivRedirectionService,
        private jerusalemRedirectionService: JerusalemRedirectionService,
        private policeRedirectionService: PoliceRedirectionService,
        private mileonRedirectionService: MileonRedirectionService,
        private metroparkRedirectionService: MetroparkRedirectionService,
        private kfarSabaRedirectionService: KfarSabaRedirectionService,
        private city4uRedirectionService: City4uRedirectionService,
        private systemUserManualRedirectionService: SystemUserManualRedirectionService,
    ) {}

    async batchMunicipallyRedirectNominations(
        dto: BatchMunicipalRedirectionDto,
        identity: IdentityDto,
        socket: DistributedWebsocket,
    ): Promise<BatchRedirectionsResult> {
        const successfulRedirections: SuccessfulRedirectionResult[] = [];
        const failedRedirections: FailedRedirectionResult[] = [];
        const total = dto.nominationIds.length;
        const batchId = v4();
        socket.emit('batch-municipal-redirection', { total, successful: successfulRedirections.length, failed: failedRedirections.length });
        for (const nominationId of dto.nominationIds) {
            try {
                const result = await this.municipallyRedirectNomination(nominationId, identity.accountId, identity.user, socket, batchId);
                successfulRedirections.push({ result, nominationId });
            } catch (e) {
                const nomination = await Nomination.findWithMinimalRelations()
                    .andWhere('nomination.nominationId = :nominationId', { nominationId })
                    .getOne();
                failedRedirections.push({ error: e, nominationId, result: nomination });
            }
            socket.emit('batch-municipal-redirection', {
                total,
                successful: successfulRedirections.length,
                failed: failedRedirections.length,
            });
        }

        return {
            successfulRedirections,
            failedRedirections,
        };
    }

    /**
     *
     * @param nominationId The id of the nomination that we're running a
     * redirection over.
     * @param accountId The account id of the OWNER of the vehicle
     * @param requestUser The user requesting the redirection
     * @param socket The socket connected for the redirection request
     * @param batchId The batch id if this is a batch action
     */
    async municipallyRedirectNomination(
        nominationId: number,
        accountId: number,
        requestUser: User,
        socket: DistributedWebsocket,
        batchId: string = 'not-batch',
    ): Promise<Nomination> {
        this.logger.log({
            message: 'Municipally Redirecting Nomination: ',
            detail: { nominationId, batchId },
            fn: this.municipallyRedirectNomination.name,
        });
        let nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();

        // 1. Data checks
        this.checkNominationDataRules(accountId, nomination, socket);

        // 2. Checking details
        socket.emit('municipal-redirection', { message: 'Re-checking redirectionDetails' });
        const redirectionDetails = await this.getRedirectionDetailsService.getRedirectionDetails(nomination.infringement.infringementId);
        if (!redirectionDetails.ready) {
            // let them know
            socket.emit('municipal-redirection', { message: `This infringement is not ready for redirection`, type: 'error' });
            throw new BadRequestException({
                message: ERROR_CODES.E084_InfringementNotReadyForRedirection.message(),
                context: redirectionDetails,
            });
        }
        socket.emit('municipal-redirection', { message: 'Redirection ready' });
        try {
            // If ready, generate nomination document

            //if (this.isSystemUserManualRedirection(redirectionDetails)) {
                // In this case, we don't want to update any redirection details
            //    nomination = await this.systemUserManualRedirectionService.redirect(nominationId, redirectionDetails, socket);
            //    socket.emit('municipal-redirection', { message: 'Redirection complete' });
            //    return nomination;
            //}
            //else
            if(redirectionDetails.type == RedirectionType.City4u)
            {
                if(redirectionDetails.infringement.issuer.name == 'חולון')
                {
                    nomination = await this.manualRedirectionService.redirect(nominationId, redirectionDetails, socket);
                }
                else
                    nomination = await this.city4uRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket); 
            }
            else if (redirectionDetails.type === RedirectionType.Manual) {
                nomination = await this.manualRedirectionService.redirect(nominationId, redirectionDetails, socket);
            } else if (redirectionDetails.type === RedirectionType.ATG) {
                try{
                    nomination = await this.automationRedirectionService.redirect(nominationId, redirectionDetails, socket);
                }catch(e){
                     nomination = await this.manualRedirectionService.redirect(nominationId, redirectionDetails, socket);
                }
            } else if (redirectionDetails.type === RedirectionType.Telaviv) {
                nomination = await this.telavivRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket);
            } else if (redirectionDetails.type === RedirectionType.Jerusalem) {
                nomination = await this.jerusalemRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket);
            } else if (redirectionDetails.type === RedirectionType.Police) {
                nomination = await this.policeRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket);
            } else if (redirectionDetails.type === RedirectionType.Mileon) {
                nomination = await this.mileonRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket);
            } else if (redirectionDetails.type === RedirectionType.Metropark) {
                //nomination = await this.metroparkRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket);
                nomination =await this.manualRedirectionService.redirect(nominationId, redirectionDetails, socket);
            } else if (redirectionDetails.type === RedirectionType.KfarSaba) {
                //nomination = await this.kfarSabaRedirectionService.redirect(nominationId, redirectionDetails, requestUser, socket);
                nomination =await this.manualRedirectionService.redirect(nominationId, redirectionDetails, socket);
            }

        } catch (error) {
            await this.saveRedirectionRequestError(nomination, error)
            throw error;
        }

        socket.emit('municipal-redirection', { message: 'Saving the details' });

        // After a redirection, we should set the raw redirection identifier. I spoke to
        //  Benny today and we said that raw redirection identifiers should be set on
        //  any internal action. 03-02-2021
        const contract = nomination.infringement.contract as LeaseContract;
        nomination.rawRedirectionIdentifier = contract?.user?.identifier;

        // Save details
        nomination = await this.saveRedirectionDetailsAndUpdateStatus(nomination, redirectionDetails);

        socket.emit('municipal-redirection', { message: 'Redirection complete' });

        return nomination;
    }

    /**
     *
     * @param nominationId The id of the nomination that we're running a
     * redirection over.
     * @param accountId The account id of the OWNER of the vehicle
     * @param requestUser The user requesting the redirection
     * @param socket The socket connected for the redirection request
     * @param batchId The batch id if this is a batch action
     */
     async municipallyRedirectNominationByMail(
        nominationId: number,
        accountId: number,
        requestUser: User,
        socket: DistributedWebsocket,
        batchId: string = 'not-batch',
    ): Promise<Nomination> {
        this.logger.log({
            message: 'Municipally Redirecting Nomination By Mail: ',
            detail: { nominationId, batchId },
            fn: this.municipallyRedirectNominationByMail.name,
        });
        let nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();

        // 1. Data checks
        this.checkNominationDataRules(accountId, nomination, socket);

        // 2. Checking details
        socket.emit('municipal-redirection', { message: 'Re-checking redirectionDetails' });
        const redirectionDetails = await this.getRedirectionDetailsService.getRedirectionDetails(nomination.infringement.infringementId);
        if (!redirectionDetails.ready) {
            // let them know
            socket.emit('municipal-redirection', { message: `This infringement is not ready for redirection`, type: 'error' });
            throw new BadRequestException({
                message: ERROR_CODES.E084_InfringementNotReadyForRedirection.message(),
                context: redirectionDetails,
            });
        }
        socket.emit('municipal-redirection', { message: 'Redirection ready' });
        try {
            nomination = await this.manualRedirectionService.redirect(nominationId, redirectionDetails, socket);
        } catch (error) {
            await this.saveRedirectionRequestError(nomination, error)
            throw error;
        }

        socket.emit('municipal-redirection', { message: 'Saving the details' });

        // After a redirection, we should set the raw redirection identifier. I spoke to
        //  Benny today and we said that raw redirection identifiers should be set on
        //  any internal action. 03-02-2021
        const contract = nomination.infringement.contract as LeaseContract;
        nomination.rawRedirectionIdentifier = contract?.user?.identifier;

        // Save details
        nomination = await this.saveRedirectionDetailsAndUpdateStatus(nomination, redirectionDetails);

        socket.emit('municipal-redirection', { message: 'Redirection complete' });

        return nomination;
    }

    private checkNominationDataRules(accountId: number, nomination: Nomination, socket: DistributedWebsocket) {
        if (isNil(nomination)) {
            socket.emit('municipal-redirection', { message: 'Could not find the nomination', type: 'error' });
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message() });
        }

        const validNominationStatus = [
            NominationStatus.Pending,
            NominationStatus.Acknowledged,
            NominationStatus.RedirectionError,
            NominationStatus.RedirectionRequestError,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted
        ];

        if (!includes(validNominationStatus, nomination.status)) {
            socket.emit('municipal-redirection', {
                message: `This nomination has the following status; which means we cannot redirect it: ${nomination.status}`,
                type: 'error',
            });
            throw new BadRequestException({
                message: ERROR_CODES.E085_IncorrectNominationStatusForRedirection.message({ nominationStatus: nomination.status }),
            });
        }

        const contract = nomination.infringement.contract;
        if (!(contract instanceof LeaseContract)) {
            socket.emit('municipal-redirection', {
                message: `Redirection can only occur on infringements linked to Lease Contracts, we need these details for the redirection`,
                type: 'error',
            });
            throw new BadRequestException({ message: ERROR_CODES.E086_RequireLeaseContractForRedirection.message() });
        }

        if (isNil(nomination.account)) {
            socket.emit('municipal-redirection', {
                message: `There is no currently nominated account on this redirection, please contact support`,
                type: 'error',
            });
            throw new BadRequestException({ message: ERROR_CODES.E087_RequireNominatedAccountForRedirection.message() });
        }

        // If the contract user = the redirection target account id and the nomination is previously municipally redirected
        if (contract.user && contract.user.accountId === accountId && nomination.type === NominationType.Municipal) {
            this.logger.error({
                message: 'Only redirection from owner to user is supported currently',
                detail: {
                    accountId,
                },
                fn: this.municipallyRedirectNomination.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E088_OnlyRedirectionFromOwnerToUserImplemented.message() });
        }

        if (contract.owner.accountId !== accountId) {
            this.logger.warn({
                message: 'Requesting account is not the owner on the contract, only owner -> user redirection is currently supported',
                detail: {
                    nominationAccountId: nomination.account.accountId,
                    accountId,
                },
                fn: this.municipallyRedirectNomination.name,
            });
        }
    }

    @Transactional()
    private async saveRedirectionDetailsAndUpdateStatus(nomination: Nomination, readiness: MunicipalRedirectionDetails) {
        // let infringement = nomination.infringement;

        nomination.redirectedFrom = (nomination.infringement.contract as LeaseContract).owner;
        nomination.redirectionTarget = (nomination.infringement.contract as LeaseContract).user; // TODO: change to pending target
        nomination.status = NominationStatus.InRedirectionProcess;
        nomination.type = NominationType.Municipal;
        nomination.redirectionType = readiness.type;
        nomination.redirectionLetterSendDate = moment().toISOString();
        nomination.account = (nomination.infringement.contract as LeaseContract).user;
        // infringement.status = InfringementStatus.NominatedProcess;

        nomination = await nomination.save();
        // infringement.nomination = nomination;
        // infringement = await infringement.save();
        // nomination.infringement = infringement;
        return nomination;
    }

    @Transactional()
    private async saveRedirectionRequestError(nomination: Nomination, error: any) {
        // let infringement = nomination.infringement;

        nomination.status = NominationStatus.RedirectionRequestError;
        nomination.redirectionError = `${error}`;

        nomination = await nomination.save();

        return nomination;
    }

    private isSystemUserManualRedirection(redirectionDetails: MunicipalRedirectionDetails) {
        return redirectionDetails.redirectionChannel === IssuerChannels.email;
    }
}
