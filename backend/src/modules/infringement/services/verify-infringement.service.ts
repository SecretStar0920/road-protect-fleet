import { Config } from '@config/config';
import { Infringement, Vehicle } from '@entities';
import { Logger } from '@logger';
import { JerusalemSyncSingleInfringementJob } from '@modules/crawlers/jobs/jerusalem-sync-single-infringement.job';
import { MetroparkSyncSingleInfringementJob } from '@modules/crawlers/jobs/metropark-sync-single-infringement.job';
import { KfarSabaSyncSingleInfringementJob } from '@modules/crawlers/jobs/kfarSaba-sync-single-infringement.job';
import { MileonSyncSingleInfringementJob } from '@modules/crawlers/jobs/mileon-sync-single-infringement.job';
import { PoliceSyncSingleInfringementJob } from '@modules/crawlers/jobs/police-sync-single-infringement.job';
import { TelavivSyncSingleInfringementJob } from '@modules/crawlers/jobs/telaviv-sync-single-infringement.job';
import { AtgSyncSingleInfringementJob } from '@modules/partners/modules/atg/jobs/atg-sync-single-infringement.job';
import { ClientNotificationService } from '@modules/shared/modules/realtime/client-notification/client-notification.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { ShoharSyncSingleInfringementsJob } from '@modules/crawlers/jobs/shohar-sync-single-infringements.job';
import { City4uSyncSingleInfringementsJob } from '@modules/crawlers/jobs/city4u-sync-single-infringements.job';
import { MetroparkCrawlerInfringementDataService } from '@modules/crawlers/services/metropark-crawler-infringement-data.service';
import { KfarSabaCrawlerInfringementDataService } from '@modules/crawlers/services/kfarSaba-crawler-infringement-data.service';
import { ShoharCrawlerInfringementDataService } from '@modules/crawlers/services/shohar-crawler-infringement-data.service';
import { City4uCrawlerInfringementDataService } from '@modules/crawlers/services/city4u-crawler-infringement-data.service';
import { JerusalemCrawlerInfringementDataService } from '@modules/crawlers/services/jerusalem-crawler-infringement-data.service';
import { PoliceCrawlerInfringementDataService } from '@modules/crawlers/services/police-crawler-infringement-data.service';
import { AtgInfringementDataService } from '@modules/partners/modules/atg/services/atg-infringement-data.service';
import { TelavivCrawlerInfringementDataService } from '@modules/crawlers/services/telaviv-crawler-infringement-data.service';
import { MileonCrawlerInfringementDataService } from '@modules/crawlers/services/mileon-crawler-infringement-data.service';
import { InfringementVerificationProvider } from '@config/infringement';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { Brackets } from 'typeorm';

interface SuccessfulVerificationResult {
    noticeNumber: string;
}

interface FailedVerificationResult {
    error: any;
    noticeNumber: string;
}

export interface BatchVerificationResult {
    successfulVerifications: SuccessfulVerificationResult[];
    failedVerifications: FailedVerificationResult[];
}

export interface ProviderJobInformation {
    issuerCityCode?: string;
    issuerCityName?: string,
    noticeNumber?: string;
    registration?: string;
    infringementId?: number;
    issuerId?: number;
    currentBrn?: string;
}

@Injectable()
export class VerifyInfringementService {
    constructor(
        private logger: Logger,
        private atgSyncJob: AtgSyncSingleInfringementJob,
        private jerusalemSyncJob: JerusalemSyncSingleInfringementJob,
        private mileonSyncJob: MileonSyncSingleInfringementJob,
        private policeSyncJob: PoliceSyncSingleInfringementJob,
        private telavivSyncJob: TelavivSyncSingleInfringementJob,
        private metroparkSyncJob: MetroparkSyncSingleInfringementJob,
        private kfarSabaSyncJob: KfarSabaSyncSingleInfringementJob,
        private shoharSyncJob: ShoharSyncSingleInfringementsJob,
        private city4uSyncJob: City4uSyncSingleInfringementsJob,
        private clientNotificationService: ClientNotificationService,
        private atgDataService: AtgInfringementDataService,
        private jerusalemDataService: JerusalemCrawlerInfringementDataService,
        private city4uDataService: City4uCrawlerInfringementDataService,
        private telavivDataService: TelavivCrawlerInfringementDataService,
        private mileonDataService: MileonCrawlerInfringementDataService,
        private metroparkDataService: MetroparkCrawlerInfringementDataService,
        private kfarSabaDataService: KfarSabaCrawlerInfringementDataService,
        private policeDataService: PoliceCrawlerInfringementDataService,
        private shoharDataService: ShoharCrawlerInfringementDataService,
    ) {}

    async verifySingle(infringementId: number, userId?: number, socket?: DistributedWebsocket): Promise<void> {
        const fn = this.verifySingle.name;
        this.logger.debug({ message: `Verifying infringement ${infringementId}`, fn });
        const infringement = await Infringement.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .addSelect(['issuer.integrationDetails'])
            .getOne();

        if (isNil(infringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }) });
        }
        
        const issuer = infringement.issuer;
        const result = await this.queueInfringementVerification(infringement, userId);

        if (socket && result?.data?.uuid) {
            this.clientNotificationService.notify(socket, {
                message: `Verification started. Click to view progress of job ${result.data.uuid} in the job log.`,
                data: {
                    uuid: result.data.uuid,
                },
                event: 'verification',
            });
        }

        if (result) {
            return;
        }

        // If no data service available for the given provider, then send to frontend
        throw new BadRequestException({
            message: ERROR_CODES.E077_IssuerDoesntHaveVerificationsEndpoint.message({ issuerName: issuer?.name }),
            context: { infringementId, issuer },
        });
    }

    async queueInfringementVerification(infringement: Infringement, userId?: number) {
        const issuer = infringement.issuer;
        let provider = issuer?.integrationDetails?.verificationProvider;
        let providerJobInfo: ProviderJobInformation = {
            issuerCityCode: infringement.issuer?.integrationDetails?.code
                ? infringement.issuer?.integrationDetails?.code
                : infringement.issuer?.code,
            issuerCityName: infringement.issuer?.integrationDetails?.name
            ? infringement.issuer?.integrationDetails?.name
            : infringement.issuer?.name,
            noticeNumber: infringement.noticeNumber,
            registration: infringement.vehicle?.registration,
            infringementId: infringement.infringementId,
            issuerId: infringement.issuer?.issuerId,
        };
        if(issuer.issuerId == 499)
        {
            let infringementDate = new Date(infringement.offenceDate);
            let providerChangeDate= new Date('2021-04-20');
            if(infringementDate<providerChangeDate)
            {
                provider=InfringementVerificationProvider.Metropark;
                providerJobInfo.issuerCityCode='12';
            }
        }
        return this.dispatchProviderJobs(provider, providerJobInfo, userId);
    }

    async dispatchProviderJobs(provider: InfringementVerificationProvider, providerJobInfo: ProviderJobInformation, userId?: number) {
        let result;

        // Go through providers
        // Add other if statements below if other providers become available
        const verifiableProviders = Config.get.infringement.verifiableProviders;
        if (provider === verifiableProviders.atg) {
            result = await this.atgSyncJob.dispatchJob(
                {
                    issuerCityCode: providerJobInfo.issuerCityCode,
                    issuerCityName: providerJobInfo.issuerCityName,
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }

        if (provider === verifiableProviders.jerusalem) {
            result = await this.jerusalemSyncJob.dispatchJob(
                {
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }

        if (provider === verifiableProviders.telaviv) {
            result = await this.telavivSyncJob.dispatchJob(
                {
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }

        if (provider === verifiableProviders.mileon) {
            result = await this.mileonSyncJob.dispatchJob(
                {
                    issuerId: providerJobInfo.issuerId,
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }

        if (provider === verifiableProviders.metropark) {
            result = await this.metroparkSyncJob.dispatchJob(
                {
                    issuerId: providerJobInfo.issuerId,
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }

        if (provider === verifiableProviders.kfarSaba) {
            result = await this.kfarSabaSyncJob.dispatchJob(
                {
                    issuerId: providerJobInfo.issuerId,
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }

        if (provider === verifiableProviders.police) {
            result = await this.policeSyncJob.dispatchJob(
                {
                    noticeNumber: providerJobInfo.noticeNumber,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
            );
        }

        if (provider === verifiableProviders.shohar) {
            result = await this.shoharSyncJob.dispatchJob(
                {
                    issuerId: providerJobInfo.issuerId,
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }
        if (provider === verifiableProviders.city4u) {
            result = await this.city4uSyncJob.dispatchJob(
                {
                    issuerId: providerJobInfo.issuerId,
                    noticeNumber: providerJobInfo.noticeNumber,
                    registration: providerJobInfo.registration,
                    infringementId: providerJobInfo.infringementId,
                    currentBrn: providerJobInfo.currentBrn,
                },
                { lifo: true },
                userId,
            );
        }
        return result;
    }

    async dispatchJobToAllProviders(providerJobInfo: ProviderJobInformation, userId?: number) {
        this.logger.debug({
            message: `Dispatching job for all providers for notice number: ${providerJobInfo.noticeNumber}`,
            detail: providerJobInfo,
            fn: this.dispatchJobToAllProviders.name,
        });
        const results = [];
        // Go through providers
        // Add other if statements below if other providers become available
        results.push(
            (
                await this.atgSyncJob.dispatchJob(
                    {
                        issuerCityCode: providerJobInfo.issuerCityCode,
                        issuerCityName: providerJobInfo.issuerCityName,
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        results.push(
            (
                await this.jerusalemSyncJob.dispatchJob(
                    {
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        results.push(
            (
                await this.telavivSyncJob.dispatchJob(
                    {
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        results.push(
            (
                await this.mileonSyncJob.dispatchJob(
                    {
                        issuerId: providerJobInfo.issuerId,
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        results.push(
            (
                await this.metroparkSyncJob.dispatchJob(
                    {
                        issuerId: providerJobInfo.issuerId,
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        results.push(
            (
                await this.kfarSabaSyncJob.dispatchJob(
                    {
                        issuerId: providerJobInfo.issuerId,
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        results.push(
            (
                await this.policeSyncJob.dispatchJob(
                    {
                        noticeNumber: providerJobInfo.noticeNumber,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                )
            )?.data,
        );
        results.push(
            (
                await this.shoharSyncJob.dispatchJob(
                    {
                        issuerId: providerJobInfo.issuerId,
                        noticeNumber: providerJobInfo.noticeNumber,
                        registration: providerJobInfo.registration,
                        infringementId: providerJobInfo.infringementId,
                        currentBrn: providerJobInfo.currentBrn,
                    },
                    { lifo: true },
                    userId,
                )
            )?.data,
        );
        return results;
    }

    async verify(infringementIds: number[], userId?: number, socket?: DistributedWebsocket) {
        for (const infringementId of infringementIds) {
            try {
                await this.verifySingle(infringementId, userId);
            } catch (error) {
                this.logger.error({
                    message: error.message,
                    fn: this.verify.name,
                    detail: error,
                });
            }
        }

        if (socket) {
            this.clientNotificationService.notify(socket, {
                message: `Batch verification started. Click to view the job log.`,
                event: 'verification',
            });
        }
    }

    async synchronousVerifyInfringementByNoticeNumbers(
        noticeNumbers: number[],
        userId?: number,
        socket?: DistributedWebsocket,
    ): Promise<BatchVerificationResult> {
        const successfulVerifications: SuccessfulVerificationResult[] = [];
        const failedVerifications: FailedVerificationResult[] = [];
        for (const noticeNumber of noticeNumbers) {
            try {
                const infringement = await Infringement.findByNoticeNumber(String(noticeNumber));
                if (!infringement) {
                    this.logger.error({
                        message: `Could not find an infringement with notice number: ${noticeNumber}`,
                        fn: this.synchronousVerifyInfringementByNoticeNumbers.name,
                    });
                    failedVerifications.push({
                        noticeNumber: String(noticeNumber),
                        error: `Could not find an infringement with notice number: ${noticeNumber}`,
                    });
                    continue;
                }
                await this.synchronousVerification(infringement.infringementId, socket);
                successfulVerifications.push({ noticeNumber: String(noticeNumber) });
            } catch (error) {
                this.logger.error({
                    message: error.message,
                    fn: this.synchronousVerifyInfringementByNoticeNumbers.name,
                    detail: error,
                });
                failedVerifications.push({ noticeNumber: String(noticeNumber), error });
            }
        }
        return { successfulVerifications, failedVerifications };
    }

    async synchronousVerifyInfringementByBrn(
        brn: string,
        userId?: number,
        socket?: DistributedWebsocket,
    ): Promise<BatchVerificationResult> {
        const successfulVerifications: SuccessfulVerificationResult[] = [];
        const failedVerifications: FailedVerificationResult[] = [];
        const infringements = await Infringement.findWithMinimalRelationsAndAccounts()
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('infringement.brn = :brn', { brn });
                    qb.orWhere('user.accountId = :brn', { brn });
                    qb.orWhere('owner.accountId = :brn', { brn });
                }),
            )
            .getMany();
        this.logger.debug({
            message: `Verifying ${infringements.length} infringements with brn: ${brn}`,
            fn: this.synchronousVerifyInfringementByBrn.name,
        });
        for (const infringement of infringements) {
            try {
                await this.synchronousVerification(infringement.infringementId, socket);
                successfulVerifications.push({ noticeNumber: infringement.noticeNumber });
            } catch (error) {
                this.logger.error({
                    message: error.message,
                    fn: this.synchronousVerifyInfringementByBrn.name,
                    detail: error,
                });
                failedVerifications.push({ noticeNumber: infringement.noticeNumber, error });
            }
        }
        return { successfulVerifications, failedVerifications };
    }

    async synchronousVerifyInfringementByVehicle(
        registration: string,
        userId?: number,
        socket?: DistributedWebsocket,
    ): Promise<BatchVerificationResult> {
        const successfulVerifications: SuccessfulVerificationResult[] = [];
        const failedVerifications: FailedVerificationResult[] = [];
        const vehicle = await Vehicle.findOneByRegistrationOrId(registration);
        if (!vehicle) {
            this.logger.error({
                message: `No vehicle found with registration: ${registration}`,
                fn: this.synchronousVerifyInfringementByVehicle.name,
            });
        }
        const infringements = vehicle.infringements;
        this.logger.debug({
            message: `Verifying ${infringements.length} infringements for vehicle registration: ${registration}`,
            fn: this.synchronousVerifyInfringementByVehicle.name,
        });
        for (const infringement of infringements) {
            try {
                await this.synchronousVerification(infringement.infringementId, socket);
                successfulVerifications.push({ noticeNumber: infringement.noticeNumber });
            } catch (error) {
                this.logger.error({
                    message: error.message,
                    fn: this.synchronousVerifyInfringementByVehicle.name,
                    detail: error,
                });
                failedVerifications.push({ noticeNumber: infringement.noticeNumber, error });
            }
        }
        return { successfulVerifications, failedVerifications };
    }

    async synchronousVerification(infringementId: number, socket?: DistributedWebsocket) {
        const fn = this.synchronousVerification.name;
        if (socket) {
            this.clientNotificationService.notify(socket, {
                message: `Verification started.`,
                event: 'verification-start',
            });
        }
        this.logger.debug({ message: `Verifying infringement ${infringementId}`, fn });
        const infringement = await Infringement.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .addSelect(['issuer.integrationDetails'])
            .getOne();

        if (isNil(infringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }) });
        }

        const issuer = infringement.issuer;
        let provider = issuer?.integrationDetails?.verificationProvider;
        let providerJobInfo: ProviderJobInformation = {
            issuerCityCode: infringement.issuer?.integrationDetails?.code
                ? infringement.issuer?.integrationDetails?.code
                : infringement.issuer?.code,
            noticeNumber: infringement.noticeNumber,
            registration: infringement.vehicle?.registration,
            infringementId: infringement.infringementId,
            issuerId: infringement.issuer?.issuerId,
        };
        if(issuer.issuerId == 499)
        {

            let infringementDate = new Date(infringement.offenceDate);
            let providerChangeDate= new Date('2021-04-20');
            if(infringementDate<providerChangeDate)
            {
                provider=InfringementVerificationProvider.Metropark;
                providerJobInfo.issuerCityCode='12';
            }
        }
       
        const result = await this.verifyInfringementByProvider(provider, providerJobInfo);

        if (socket && result) {
            this.clientNotificationService.notify(socket, {
                message: `Verification successfully completed. Click to view infringement ${infringement.noticeNumber}`,
                data: { infringement },
                event: 'verification-success',
            });
        }

        if (result) {
            return result;
        }

        // If no data service available for the given provider, then send to frontend
        throw new BadRequestException({
            message: ERROR_CODES.E077_IssuerDoesntHaveVerificationsEndpoint.message({ issuerName: issuer.name }),
            context: { infringementId, issuer },
        });
    }

    async verifyInfringementByProvider(provider: InfringementVerificationProvider, providerJobInfo: ProviderJobInformation) {
        let result;
        // Go through providers
        // Add other if statements below if other providers become available
        const verifiableProviders = Config.get.infringement.verifiableProviders;
        if (provider === verifiableProviders.atg) {
            result = await this.atgDataService.verifyInfringement(
            providerJobInfo.issuerCityCode,
            providerJobInfo.issuerCityName,
            providerJobInfo.noticeNumber,
            providerJobInfo.registration,
            );  
        }
        
        if (provider === verifiableProviders.jerusalem) {
            result = await this.jerusalemDataService.verifyInfringement(
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (provider === verifiableProviders.telaviv) {
            result = await this.telavivDataService.verifyInfringement(
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (provider === verifiableProviders.mileon) {
            result = await this.mileonDataService.verifyInfringement(
                providerJobInfo.issuerId,
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (provider === verifiableProviders.metropark) {
            result = await this.metroparkDataService.verifyInfringement(
                providerJobInfo.issuerId,
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (provider === verifiableProviders.kfarSaba) {
            result = await this.kfarSabaDataService.verifyInfringement(
                providerJobInfo.issuerId,
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (provider === verifiableProviders.police) {
            result = await this.policeDataService.verifyInfringement(providerJobInfo.noticeNumber, providerJobInfo.infringementId);
        }
        if (provider === verifiableProviders.shohar) {
            result = await this.shoharDataService.verifyInfringement(
                providerJobInfo.issuerId,
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (provider === verifiableProviders.city4u) {
            result = await this.city4uDataService.verifyInfringement(
                providerJobInfo.issuerId,
                providerJobInfo.noticeNumber,
                providerJobInfo.registration,
                providerJobInfo.infringementId,
            );
        }
        if (result?.infringement) {
            this.logger.debug({
                message: `Successfully verified infringement ${result.infringement.infringementId}`,
                fn: this.verifyInfringementByProvider.name,
            });
            return result.infringement;
        }
        this.logger.error({
            message: `Failed to verify infringement by provider`,
            fn: this.verifyInfringementByProvider.name,
            detail: { providerJobInfo, result },
        });
    }
}
