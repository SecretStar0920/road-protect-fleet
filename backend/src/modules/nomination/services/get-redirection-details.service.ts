import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { Account, Infringement, InfringementStatus, LeaseContract, NominationType, RedirectionType } from '@entities';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { Logger } from '@logger';
import { GetRedirectionDetailsBatchDto } from '@modules/infringement/controllers/get-redirection-details-batch.dto';
import { BatchMunicipalRedirectionDetails } from '@modules/nomination/dtos/batch-municipal-redirection.details';
import { MunicipalRedirectionDetails } from '@modules/nomination/dtos/municipal-redirection.details';
import { ExtractRedirectionAddressDetailsService } from '@modules/nomination/services/extract-redirection-address-details.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { get, groupBy, some } from 'lodash';
import { v4 } from 'uuid';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Injectable()
export class GetRedirectionDetailsService {
    constructor(
        private logger: Logger,
        private atgIssuers: AtgIssuers,
        private extractRedirectionAddressDetailsService: ExtractRedirectionAddressDetailsService,
        private driverRedirectionService: DriverRedirectionService,
    ) {}

    async getRedirectionDetailsBatch(dto: GetRedirectionDetailsBatchDto) {
        const batchId = v4();
        this.logger.debug({
            message: 'Checking batch infringement redirection readiness',
            detail: { dto, batchId },
            fn: this.getRedirectionDetailsBatch.name,
        });
        const redirectionDetails: MunicipalRedirectionDetails[] = [];
        const redirectToDriver: number[] = [];
        for (const infringementId of dto.infringementIds) {
            try {
                const details = await this.getRedirectionDetails(infringementId, batchId);
                redirectionDetails.push(details);
                if (details.hasDriverContract) {
                    redirectToDriver.push(infringementId);
                }
            } catch (e) {
                this.logger.error({
                    message: `Failed to get redirection details for ${infringementId}`,
                    fn: this.getRedirectionDetailsBatch.name,
                });
            }
        }

        const groupedDetails = groupBy(redirectionDetails, (details) => (details.ready ? 'ready' : 'unready'));
        const batchDetails = new BatchMunicipalRedirectionDetails();
        batchDetails.ready = {
            redirections: groupedDetails.ready || [],
            summary: { count: (groupedDetails.ready || {}).length || 0 },
            redirectToDriver,
        };
        batchDetails.unready = {
            redirections: groupedDetails.unready || [],
            summary: { count: (groupedDetails.unready || {}).length || 0 },
        };

        return batchDetails;
    }

    async getRedirectionDetails(infringementId: number, batchId: string = 'not-batch'): Promise<MunicipalRedirectionDetails> {
        this.logger.log({
            message: `===============Getting Infringement Readiness with id: `,
            detail: { infringementId, batchId },
            fn: this.getRedirectionDetails.name,
        });

        const details = new MunicipalRedirectionDetails();

        // Check infringement existence
        const infringement = await Infringement.createQueryBuilder('infringement')
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .getOne();
        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }) });
        }

        // Readiness details
        details.infringement = infringement;
        // Big Query to gather all the information we need to do our checks
        const infringementToCheck = await Infringement.createQueryBuilder('infringement')
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .leftJoinAndSelect('infringement.contract', 'contract', 'contract.type = :type', { type: LeaseContract.name })
            .leftJoinAndSelect('contract.document', 'document')
            .leftJoinAndSelect('contract.user', 'user')
            .leftJoinAndSelect('user.powerOfAttorney', 'user_powerOfAttorney')
            .leftJoinAndSelect('contract.owner', 'owner')
            .addSelect('owner.fleetManagerDetails') // For signature check
            .leftJoinAndSelect('owner.powerOfAttorney', 'owner_powerOfAttorney')
            .leftJoinAndSelect('contract.redirectionDocument', 'leaseRedirectionDocument')
            .leftJoinAndSelect('infringement.nomination', 'nomination')
            .leftJoinAndSelect('nomination.mergedDocument', 'mergedDocument')
            .leftJoinAndSelect('nomination.redirectionDocument', 'nominationRedirectionDocument')
            .leftJoinAndSelect('infringement.issuer', 'issuer')
            .leftJoinAndSelect('nomination.account', 'account')
            .leftJoinAndSelect('account.powerOfAttorney', 'account_powerOfAttorney')
            .getOne();

        details.nomination = infringementToCheck.nomination;

        // Readiness potentially depends on the type which depends on the issuer
        details.type = await this.getRedirectionType(infringementToCheck);
        details.redirectionChannel = infringementToCheck.issuer.integrationDetails?.channels?.redirections;

        // Power of Attorney
        const powerOfAttorneyAccount = await this.findPowerOfAttorneyOfInfringementOwner(
            infringement,
            infringementToCheck.contract?.owner,
            infringementToCheck.nomination.account,
        );

        //////////////////////////////////////////////////////////////////
        // Check infringement statuses to ensure it can be redirected
        //////////////////////////////////////////////////////////////////

        const validNominationStatuses = [
            NominationStatus.Pending,
            NominationStatus.Acknowledged,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted,
            NominationStatus.RedirectionError,
            NominationStatus.RedirectionRequestError,

        ];
        const validInfringementStatuses = [InfringementStatus.Due, InfringementStatus.Outstanding];
        details.hasValidStatus = {
            nominationStatus: some(validNominationStatuses, (s) => s === infringementToCheck.nomination.status),
            infringementStatus: some(validInfringementStatuses, (s) => s === infringementToCheck.status),
            status:
                some(validNominationStatuses, (s) => s === infringementToCheck.nomination.status) &&
                some(validInfringementStatuses, (s) => s === infringementToCheck.status),
        };

        //////////////////////////////////////////////////////////////////
        // Has Drivers Contract
        //////////////////////////////////////////////////////////////////

        const driversContract = await this.driverRedirectionService.getDriverContract(infringementId);
        details.hasDriverContract = !!driversContract?.contractId;

        //////////////////////////////////////////////////////////////////
        // Lease or substitute Lease
        //////////////////////////////////////////////////////////////////

        details.hasLeaseDocument = {
            status: !!get(infringementToCheck, 'contract.document', false),
            contractId: get(infringementToCheck, 'contract.contractId', null),
        };

        details.hasLeaseSubstituteDocument = {
            status: !!get(infringementToCheck, 'contract.redirectionDocument', false),
            contractId: get(infringementToCheck, 'contract.contractId', null),
        };

        //////////////////////////////////////////////////////////////////
        // Power of Attorney
        //////////////////////////////////////////////////////////////////

        details.hasPowerOfAttorneyDocument = {
            status: !!powerOfAttorneyAccount?.powerOfAttorney?.documentId,
            accountId: powerOfAttorneyAccount?.accountId || null,
        };

        //////////////////////////////////////////////////////////////////
        // Signature
        //////////////////////////////////////////////////////////////////

        const fleetManagerDetails = get(infringementToCheck, 'contract.owner.fleetManagerDetails', null);
        details.hasSignatureAvailable = {
            status: !!fleetManagerDetails || !!Config.get.systemSignature.Ore, // Should always be true, but including it for understanding
            type: fleetManagerDetails ? 'Natural' : 'RP',
            details: fleetManagerDetails || Config.get.systemSignature.Ore,
        };

        //////////////////////////////////////////////////////////////////
        // Address
        //////////////////////////////////////////////////////////////////
        const userAddressDetails = await this.extractRedirectionAddressDetailsService.extractRedirectionAddressDetails(
            get(infringementToCheck, 'contract.user', null),
        );
        details.hasValidRedirectionUserAddress = {
            status: userAddressDetails.valid,
            details: userAddressDetails,
        };
        const ownerAddressDetails = await this.extractRedirectionAddressDetailsService.extractRedirectionAddressDetails(
            get(infringementToCheck, 'contract.user', null),
        );
        details.hasValidRedirectionOwnerAddress = {
            status: ownerAddressDetails.valid,
            details: ownerAddressDetails,
        };

        if (details.type === RedirectionType.ATG) {
            // If it's ATG it is ready when we have a valid power of attorney, valid lease or lease substitute, valid streetCode redirection address and a valid signature
            details.ready =
                details.hasPowerOfAttorneyDocument.status &&
                (details.hasLeaseSubstituteDocument.status || details.hasLeaseDocument.status) &&
                details.hasValidRedirectionUserAddress.status &&
                details.hasSignatureAvailable.status &&
                details.hasValidStatus.status;
        } else if (
            details.type === RedirectionType.Manual ||
            details.type === RedirectionType.Telaviv ||
            details.type === RedirectionType.Jerusalem ||
            details.type === RedirectionType.Police ||
            details.type === RedirectionType.Mileon ||
            details.type === RedirectionType.Metropark||
            details.type === RedirectionType.City4u
        ) {
            // If it's a manual redirection it has the same requirements except for the stricter address check. Check is separated to allow deviation in the future
            details.ready =
                details.hasPowerOfAttorneyDocument.status &&
                (details.hasLeaseSubstituteDocument.status || details.hasLeaseDocument.status) &&
                details.hasSignatureAvailable.status &&
                details.hasValidStatus.status;
        }

        this.logger.log({
            message: `Found Infringement readiness with id: `,
            detail: { details, batchId },
            fn: this.getRedirectionDetails.name,
        });

        return details;
    }


    async getRedirectionDetailsWithoutReadinessCheck(infringementId: number): Promise<MunicipalRedirectionDetails> {
        this.logger.log({
            message: `Getting Infringement Readiness with id: `,
            detail: { infringementId },
            fn: this.getRedirectionDetailsWithoutReadinessCheck.name,
        });

        const details = new MunicipalRedirectionDetails();

        // Check infringement existence
        const infringement = await Infringement.createQueryBuilder('infringement')
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .getOne();
        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }) });
        }

        // Readiness details
        details.infringement = infringement;
        // Big Query to gather all the information we need to do our checks
        const infringementToCheck = await Infringement.createQueryBuilder('infringement')
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .leftJoinAndSelect('infringement.contract', 'contract', 'contract.type = :type', { type: LeaseContract.name })
            .leftJoinAndSelect('contract.document', 'document')
            .leftJoinAndSelect('contract.user', 'user')
            .leftJoinAndSelect('user.powerOfAttorney', 'user_powerOfAttorney')
            .leftJoinAndSelect('contract.owner', 'owner')
            .addSelect('owner.fleetManagerDetails') // For signature check
            .leftJoinAndSelect('owner.powerOfAttorney', 'owner_powerOfAttorney')
            .leftJoinAndSelect('contract.redirectionDocument', 'leaseRedirectionDocument')
            .leftJoinAndSelect('infringement.nomination', 'nomination')
            .leftJoinAndSelect('nomination.mergedDocument', 'mergedDocument')
            .leftJoinAndSelect('nomination.redirectionDocument', 'nominationRedirectionDocument')
            .leftJoinAndSelect('infringement.issuer', 'issuer')
            .leftJoinAndSelect('nomination.account', 'account')
            .leftJoinAndSelect('account.powerOfAttorney', 'account_powerOfAttorney')
            .getOne();

        details.nomination = infringementToCheck.nomination;

        // Readiness potentially depends on the type which depends on the issuer
        details.type = RedirectionType.Manual;
        // Power of Attorney
        const powerOfAttorneyAccount = await this.findPowerOfAttorneyOfInfringementOwner(
            infringement,
            infringementToCheck.contract?.owner,
            infringementToCheck.nomination.account,
        );

        details.hasValidStatus.status= true;
        details.hasValidStatus.infringementStatus= true;
        details.hasValidStatus.nominationStatus= true;


        //////////////////////////////////////////////////////////////////
        // Has Drivers Contract
        //////////////////////////////////////////////////////////////////

        const driversContract = await this.driverRedirectionService.getDriverContract(infringementId);
        details.hasDriverContract = !!driversContract?.contractId;

        //////////////////////////////////////////////////////////////////
        // Lease or substitute Lease
        //////////////////////////////////////////////////////////////////

        details.hasLeaseDocument = {
            status: !!get(infringementToCheck, 'contract.document', false),
            contractId: get(infringementToCheck, 'contract.contractId', null),
        };

        details.hasLeaseSubstituteDocument = {
            status: !!get(infringementToCheck, 'contract.redirectionDocument', false),
            contractId: get(infringementToCheck, 'contract.contractId', null),
        };

        //////////////////////////////////////////////////////////////////
        // Power of Attorney
        //////////////////////////////////////////////////////////////////

        details.hasPowerOfAttorneyDocument = {
            status: !!powerOfAttorneyAccount?.powerOfAttorney?.documentId,
            accountId: powerOfAttorneyAccount?.accountId || null,
        };

        //////////////////////////////////////////////////////////////////
        // Signature
        //////////////////////////////////////////////////////////////////

        const fleetManagerDetails = get(infringementToCheck, 'contract.owner.fleetManagerDetails', null);
        details.hasSignatureAvailable = {
            status: !!fleetManagerDetails || !!Config.get.systemSignature.Ore, // Should always be true, but including it for understanding
            type: fleetManagerDetails ? 'Natural' : 'RP',
            details: fleetManagerDetails || Config.get.systemSignature.Ore,
        };
        details.hasValidRedirectionUserAddress.status=true;
        details.hasValidRedirectionOwnerAddress.status=true;

        details.ready = true;


        return details;
    }

    /**
     * The type is determined by whether the redirection supports an integration or if it needs to be a manual email
     * Whether it is an integration is currently determined by the existence of the ATG Issuer Code
     */
    async getRedirectionType(infringement: Infringement): Promise<RedirectionType> {
        // Assuming we have issuer at this point
        const provider = infringement.issuer?.integrationDetails?.verificationProvider;
        const channels = infringement.issuer?.integrationDetails?.channels;
        if (provider === InfringementVerificationProvider.ATG) {
            return RedirectionType.ATG;
        }

        if (provider === InfringementVerificationProvider.Telaviv) {
            return RedirectionType.Telaviv;
        }

        if (provider === InfringementVerificationProvider.Jerusalem) {
            return RedirectionType.Jerusalem;
        }

        if (provider === InfringementVerificationProvider.Police) {
            return RedirectionType.Police;
        }

        if (provider === InfringementVerificationProvider.Metropark) {
            return RedirectionType.Metropark;
        }
        if (provider === InfringementVerificationProvider.KfarSaba) {
            return RedirectionType.KfarSaba;
        }

        if (provider === InfringementVerificationProvider.Mileon)
        {
            if(!channels || !channels.redirections)
                return RedirectionType.Mileon;
        }
        // Default to manual
        return RedirectionType.Manual;
    }

    /**
     * We need to know which power of attorney to use when generating a redirection
     * document. Even though the infringement may be nominated to someone else, that
     * could just be a digital nomination meaning that we shouldn't use their power
     * of attorney, we should still use the actual owner of the infringement's power
     * of attorney.
     * @param infringement
     * @param owner
     * @param nominated
     * @private
     */
    private async findPowerOfAttorneyOfInfringementOwner(
        infringement: Infringement,
        owner?: Account,
        nominated?: Account,
    ): Promise<Account | null> {
        const account = await Account.findWithMinimalRelations()
            .where('account.identifier = :brn', {
                brn: infringement.brn,
            })
            .getOne();
        if (account && account.powerOfAttorney?.documentId) {
            return account;
        }

        // We only send the nominated account if the redirection was municipal
        return owner && owner.powerOfAttorney?.documentId
            ? owner
            : infringement.nomination?.type === NominationType.Municipal
                ? nominated
                : owner;
    }
}
