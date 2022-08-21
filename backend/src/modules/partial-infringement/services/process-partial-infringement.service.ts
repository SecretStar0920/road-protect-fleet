import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement, Issuer, PartialInfringement, PartialInfringementStatus } from '@entities';
import { ProviderJobInformation, VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import * as moment from 'moment';
import { InfringementVerificationProvider } from '@config/infringement';

@Injectable()
export class ProcessPartialInfringementService {
    constructor(private logger: Logger, private verifyInfringementService: VerifyInfringementService) {}

    async queueAllPartialInfringements() {
        const notQueued = await this.findPendingPartialInfringements();
        this.logger.debug({
            message: `Found ${notQueued.length} partial infringements that have not been queued`,
            fn: this.processPartialInfringements.name,
        });
        return this.processPartialInfringements(notQueued);
    }

    async processPartialInfringements(toProcess: PartialInfringement[]) {
        this.logger.debug({
            message: `Processing  ${toProcess.length} partial infringements`,
            fn: this.processPartialInfringements.name,
        });
        for (const partialInfringement of toProcess) {
            this.logger.debug({
                message: `Processing partial infringement:`,
                detail: partialInfringement.partialInfringementId,
                fn: this.processPartialInfringements.name,
            });
            try {
                // Setting the status to queued
                partialInfringement.status = PartialInfringementStatus.Queued;
                await partialInfringement.save();
            } catch (e) {
                this.logger.error({
                    message: `Failed to update partial infringement  ${partialInfringement.partialInfringementId} to queued, skipping..`,
                    fn: this.processPartialInfringements.name,
                    detail: { partialInfringement },
                });
                continue;
            }
            // Check for issuer
            let issuer: Issuer;
            if (partialInfringement.details.issuerName || partialInfringement.details.issuerCode) {
                const issuerDetails = partialInfringement.details.issuerName
                    ? partialInfringement.details.issuerName
                    : partialInfringement.details.issuerCode;
                issuer = await Issuer.findByNameOrCode(issuerDetails);
            }
            // Check for an existing infringement
            let infringement: Infringement;
            if (partialInfringement.details.noticeNumber) {
                infringement = await Infringement.findWithMinimalRelations()
                    .andWhere('infringement.noticeNumber = :noticeNumber', { noticeNumber: partialInfringement.details.noticeNumber })
                    .getOne();
                if (infringement) {
                }
            }
            // Set up request information
            const providerJobInfo: ProviderJobInformation = {
                issuerCityCode: partialInfringement.details.issuerCode
                    ? partialInfringement.details.issuerCode
                    : issuer?.integrationDetails?.code
                    ? issuer?.integrationDetails?.code
                    : issuer?.code
                    ? issuer?.code
                    : null,
                issuerCityName: partialInfringement.details.issuerName?  partialInfringement.details.issuerName : null,
                noticeNumber: partialInfringement.details.noticeNumber ? partialInfringement.details.noticeNumber : null,
                registration: partialInfringement.details.vehicle ? partialInfringement.details.vehicle : null,
                issuerId: issuer?.issuerId ? issuer?.issuerId : null,
                infringementId: infringement?.infringementId ? infringement.infringementId : null,
                currentBrn: partialInfringement.details.brn ? partialInfringement.details.brn : infringement?.brn ? infringement.brn : null,
            };
            // Check if there is a provider
            let provider: InfringementVerificationProvider;
            if (partialInfringement.details.provider) {
                // Given in the partial infringement
                provider = InfringementVerificationProvider[partialInfringement.details.provider];
            } else if (issuer?.provider || issuer?.integrationDetails?.verificationProvider) {
                // Checks if issuer has a provider
                if (issuer?.integrationDetails?.verificationProvider) {
                    if (Object.values(InfringementVerificationProvider).includes(issuer?.integrationDetails?.verificationProvider)) {
                        provider = issuer?.integrationDetails?.verificationProvider;
                    } else {
                        provider = InfringementVerificationProvider[issuer?.integrationDetails?.verificationProvider];
                    }
                } else {
                    provider = InfringementVerificationProvider[issuer?.provider];
                }
            }

            this.logger.debug({
                message: `Processing partial infringement:`,
                detail: { partialInfringementId: partialInfringement.partialInfringementId, providerJobInfo, provider },
                fn: this.processPartialInfringements.name,
            });

            // Process the infringement
            let job: any = null;
            if (provider) {
                this.logger.debug({
                    message: `Requesting to dispatch provider job with provider [${provider}]`,
                    fn: this.processPartialInfringements.name,
                    detail: { providerJobInfo },
                });
                job = await this.verifyInfringementService.dispatchProviderJobs(provider, providerJobInfo);
            } else {
                // No linked provider found
                this.logger.warn({
                    message: `Could not find provider, dispatching job for all available crawlers`,
                    fn: this.processPartialInfringements.name,
                    detail: { providerJobInfo },
                });
                job = await this.verifyInfringementService.dispatchJobToAllProviders(providerJobInfo);
            }

            this.logger.debug({
                message: `Finished processing partial infringement:`,
                detail: { partialInfringementId: partialInfringement.partialInfringementId, job: !!job },
                fn: this.processPartialInfringements.name,
            });

            try {
                // Setting the status to queued
                partialInfringement.status = PartialInfringementStatus.Processed;
                partialInfringement.processedDate = moment().toISOString();
                await partialInfringement.save();
            } catch (e) {
                this.logger.error({
                    message: `Failed to update partial infringement  ${partialInfringement.partialInfringementId} to processed, skipping..`,
                    fn: this.processPartialInfringements.name,
                    detail: { partialInfringement },
                });
                continue;
            }

            try {
                // Saving partial infringement changes
                if (!!job) {
                    partialInfringement.status = PartialInfringementStatus.Successful;
                } else {
                    partialInfringement.status = PartialInfringementStatus.Failed;
                }
                partialInfringement.response = provider ? job?.data : job;
                await partialInfringement.save();
                this.logger.debug({
                    message: `Successfully processed partial infringement ${partialInfringement.partialInfringementId}`,
                    fn: this.processPartialInfringements.name,
                });
            } catch (e) {
                this.logger.error({
                    message: `Failed to update partial infringement  ${partialInfringement.partialInfringementId}`,
                    fn: this.processPartialInfringements.name,
                    detail: { partialInfringement },
                });
            }
        }

        return toProcess;
    }

    async findPendingPartialInfringements(): Promise<PartialInfringement[]> {
        return await PartialInfringement.findWithMinimalRelations()
            .andWhere('status = :status', { status: PartialInfringementStatus.Pending })
            .getMany();
    }
}
