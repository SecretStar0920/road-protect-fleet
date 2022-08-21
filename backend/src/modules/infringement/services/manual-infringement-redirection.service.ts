import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ManualInfringementRedirectionDto } from '../controllers/manual-infringement-redirection-spreadsheet.dto';
import { Account, Infringement, InfringementStatus, Issuer, Log, LogPriority, LogType, NominationType } from '@entities';
import { InfringementDoesNotExistForManualRedirectionException } from '@modules/infringement/exceptions/infringement-does-not-exist-for-manual-redirection.exception';
import { IssuerDoesNotExistForManualRedirectionException } from '@modules/infringement/exceptions/issuer-does-not-exist-for-manual-redirection.exception';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { RedirectMissingInfringementsDto } from '@modules/infringement/controllers/redirect-missing-infringements.dto';
import { plainToClass } from 'class-transformer';
import { Promax } from 'promax';
import { Config } from '@config/config';
import { UpsertNominationService } from '@modules/nomination/services/upsert-nomination.service';
import { UpsertNominationDto } from '@modules/nomination/dtos/upsert-nomination.dto';
import * as moment from 'moment';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class ManualInfringementRedirectionService {
    constructor(private logger: Logger, private upsertNominationService: UpsertNominationService) {}

    async redirectMissingInfringements(dto: RedirectMissingInfringementsDto) {
        this.logger.log({
            message: `Manually redirecting infringements that were missing from the spreadsheet upload`,
            detail: dto,
            fn: this.redirectMissingInfringements.name,
        });
        const infringements = await Infringement.findWithMinimalRelations()
            .where('infringement.infringementId IN (:...infringementIds)', dto)
            .getMany();
        const promax = Promax.create(Config.get.systemPerformance.queryChunkSize, {
            throws: false,
        }).add(
            infringements.map((infringement) => async () => {
                const nominationDto = plainToClass(UpsertNominationDto, {
                    infringementId: infringement.infringementId,
                    redirectionCompletionDate: moment().toISOString(),
                    redirectionIdentifier:
                        infringement.nomination?.rawRedirectionIdentifier || infringement.nomination?.account?.identifier,
                    type: NominationType.Municipal,
                });
                const statusUpdater = StatusUpdater.create()
                    .setInitialInfringement(infringement)
                    .setInitialNomination(infringement.nomination)
                    .setSource(StatusUpdateSources.UpdateInfringement)
                    .setDto({
                        issuerStatus: NominationStatus.RedirectionCompleted,
                    });
                await this.upsertNominationService.upsertNomination(nominationDto, statusUpdater);
                await statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition().persist();
                statusUpdater.logInfo();

                await Log.createAndSave({
                    infringement,
                    vehicle: infringement.vehicle,
                    type: LogType.Updated,
                    priority: LogPriority.High,
                    message: `Manually redirected the infringement to identifier ${nominationDto.redirectionIdentifier}`,
                });

                return infringement;
            }),
        );
        await promax.run();
        return {
            infringementIds: promax.getResultMap().valid.map((infringement) => infringement?.infringementId),
            errors: promax.getResultMap().error,
        };
    }

    @Transactional()
    async manuallyRedirectInfringement(dto: ManualInfringementRedirectionDto) {
        this.logger.log({
            message: `Running a redirection of ${dto.noticeNumber} to ${dto.user} with status ${dto.complete ? 'COMPLETE' : 'IN PROGRESS'}`,
            fn: this.manuallyRedirectInfringement.name,
            detail: dto,
        });

        const issuer = await this.findIssuerOrFail(dto.issuer);
        const infringement = await this.findInfringementOrFail(dto.noticeNumber, issuer.name);

        if (this.redirectionIsToSameAccount(dto, infringement)) {
            this.logger.warn({
                fn: this.manuallyRedirectInfringement.name,
                detail: { dto, infringement },
                message: `An attempt was made to manually redirect the infringement to the same account`,
            });
            return infringement;
        }

        const account = await Account.findByIdentifierOrId(dto.user);
        const statusUpdater = StatusUpdater.create()
            .setSource(StatusUpdateSources.UpdateInfringement)
            .setInitialInfringement(infringement)
            .setInitialNomination(infringement.nomination);
        try {
            if (account) {
                await this.manuallyRedirectToSystemAccount(infringement, account, dto.complete, statusUpdater);
            } else {
                await this.manuallyRedirectToExternalAccount(infringement, dto.complete, statusUpdater, dto.user);
            }
            this.logger.debug({
                message: `Successfully redirected infringement`,
                fn: this.manuallyRedirectInfringement.name,
                detail: {
                    infringement,
                    account,
                    dto,
                },
            });
        } catch (e) {
            this.logger.error({
                message: `Failed to manually redirect nomination with error ${e.message}`,
                fn: this.manuallyRedirectInfringement.name,
                detail: {
                    infringement,
                    account,
                    dto,
                },
            });
        }
        return infringement;
    }

    private redirectionIsToSameAccount(dto: ManualInfringementRedirectionDto, infringement: Infringement) {
        return infringement.brn === dto.user;
    }

    @Transactional()
    private async manuallyRedirectToSystemAccount(
        infringement: Infringement,
        account: Account,
        complete: boolean,
        statusUpdater: StatusUpdater,
    ) {
        this.logger.debug({
            message: `Manually redirecting infringement to system account`,
            fn: this.manuallyRedirectToSystemAccount.name,
            detail: {
                infringement,
                account,
                complete,
            },
        });
        infringement.nomination.status = this.calculateNominationStatus(
            infringement,
            complete ? NominationStatus.RedirectionCompleted : NominationStatus.InRedirectionProcess,
        );

        infringement.nomination.account = account;
        if (!complete) {
            infringement.nomination.redirectionLetterSendDate = moment().toISOString();
        } else {
            infringement.brn = account.identifier;
        }

        infringement.nomination.details.redirectionReason = `Manually redirected infringement to ${account.name} (${account.identifier})`;

        statusUpdater.setFinalInfringement(infringement).setFinalNomination(infringement.nomination);
        statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition();
        await statusUpdater.persist();
        await Log.createAndSave({
            infringement,
            vehicle: infringement.vehicle,
            account,
            type: LogType.Updated,
            priority: LogPriority.High,
            message: `Manually redirected the infringement to an internal account`,
        });
    }

    @Transactional()
    private async manuallyRedirectToExternalAccount(
        infringement: Infringement,
        complete: boolean,
        statusUpdater: StatusUpdater,
        identifier: string,
    ) {
        this.logger.debug({
            message: `Manually redirecting infringement an external account`,
            fn: this.manuallyRedirectToSystemAccount.name,
            detail: {
                infringement,
                complete,
            },
        });
        infringement.nomination.status = this.calculateNominationStatus(
            infringement,
            complete ? NominationStatus.RedirectionCompleted : NominationStatus.InRedirectionProcess,
        );

        infringement.nomination.account = null;
        infringement.status = InfringementStatus.Closed;
        if (!complete) {
            infringement.nomination.redirectionLetterSendDate = moment().toISOString();
        } else {
            infringement.brn = identifier;
        }
        infringement.nomination.details.redirectionReason = `Manually redirected infringement to external account`;

        statusUpdater.setFinalInfringement(infringement).setFinalNomination(infringement.nomination);
        statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition();
        await statusUpdater.persist();
        await Log.createAndSave({
            infringement,
            vehicle: infringement.vehicle,
            type: LogType.Updated,
            priority: LogPriority.High,
            message: `Manually redirected the infringement to an external account`,
        });

        statusUpdater.setInitialInfringement(infringement).setInitialNomination(infringement.nomination);
        infringement.nomination.status = this.calculateNominationStatusAfterRedirection(infringement);
        await statusUpdater
            .setFinalInfringement(infringement)
            .setFinalNomination(infringement.nomination)
            .resolveStatusUpdates()
            .throwIfInvalidStatusTransition()
            .persist();
    }

    private calculateNominationStatus(infringement: Infringement, currentStatus: NominationStatus) {
        if (infringement.status === InfringementStatus.Closed || infringement.status === InfringementStatus.Paid) {
            return NominationStatus.Closed;
        }
        return currentStatus;
    }

    private calculateNominationStatusAfterRedirection(infringement: Infringement) {
        if (infringement.status === InfringementStatus.Due || infringement.status === InfringementStatus.Outstanding) {
            return NominationStatus.Acknowledged;
        }
        return NominationStatus.Closed;
    }

    private async findInfringementOrFail(noticeNumber: string, issuer: string): Promise<Infringement> {
        const infringement = Infringement.findByNoticeNumberAndIssuer(noticeNumber, issuer).getOne();

        if (!infringement) {
            throw new InfringementDoesNotExistForManualRedirectionException(noticeNumber, issuer);
        }

        return infringement;
    }

    private async findIssuerOrFail(issuer: string): Promise<Issuer> {
        const issuerModel = await Issuer.findByNameOrCode(issuer);
        if (!issuerModel) {
            throw new IssuerDoesNotExistForManualRedirectionException(issuer);
        }
        return issuerModel;
    }
}
