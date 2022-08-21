import {
    Account,
    Infringement,
    INFRINGEMENT_CONSTRAINTS,
    InfringementStatus,
    Log,
    LogPriority,
    LogType,
    ManualPayment,
    RawLocationParserHelper,
} from '@entities';
import { Logger } from '@logger';
import { UpdateInfringementDto, UpdateInfringementSpreadsheetDto } from '@modules/infringement/controllers/update-infringement.dto';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { LinkingService } from '@modules/shared/services/linking.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { isNil, merge, omit } from 'lodash';
import * as moment from 'moment';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StandardNominationRulesService } from '@modules/nomination/services/standard-nomination-rules.service';
import { ExternalPaymentService } from '@modules/payment/services/external-payment.service';
import { StandardInfringementRulesService } from '@modules/infringement/services/standard-infringement-rules.service';
import { SaveNewInfringementLogJob } from '@modules/infringement/jobs/save-new-infringement-log.job';
import { RedirectionParametersService } from '@modules/nomination/services/redirection-parameters.service';
import { UpdateInfringementOriginalAmountService } from '@modules/infringement/services/update-infringement-original-amount.service';
import { UpdateInfringementPenaltyAmountService } from '@modules/infringement/services/update-infringement-penalty-amount.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';
import { GetInfringementNotesService } from '@modules/infringement-note/services/get-infringement-notes.service';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { GetDocumentService } from '@modules/document/services/get-document.service';

@Injectable()
// @LoggerClass()
/**
 * Current Process: https://drive.google.com/file/d/1y6Y59tV4-i0YO8PbbfwI0R4k4OK7mf_Q/view?usp=sharing
 */
export class UpdateInfringementService {
    constructor(
        private logger: Logger,
        private linkingService: LinkingService,
        private standardNominationRulesService: StandardNominationRulesService,
        private externalPaymentService: ExternalPaymentService,
        private standardInfringementRulesService: StandardInfringementRulesService,
        private saveNewInfringementLogJob: SaveNewInfringementLogJob,
        private redirectionParametersService: RedirectionParametersService,
        private updateInfringementOriginalAmountService: UpdateInfringementOriginalAmountService,
        private updateInfringementPenaltyAmountService: UpdateInfringementPenaltyAmountService,
        private upsertInfringementNoteService: UpsertInfringementNoteService,
        private getInfringementNotesService: GetInfringementNotesService,
        private getDocumentService: GetDocumentService,
    ) {}

    @Transactional()
    // @LoggerMethod()
    async updateBySpreadsheetDto(dto: UpdateInfringementSpreadsheetDto): Promise<Infringement> {
        let sanitisedDto = omitNull(dto);
        if (sanitisedDto.rawAddress) {
            const locationSingleDto: UpdateLocationSingleDto = plainToClass(UpdateLocationSingleDto, dto);
            const mappedLocationDto: UpdateLocationDetailedDto = RawLocationParserHelper.parseUpdateDto(locationSingleDto);
            sanitisedDto = merge(sanitisedDto, mappedLocationDto);
        }

        const infringement = await Infringement.findByNoticeNumberAndIssuer(dto.noticeNumber, dto.issuer).getOne();
        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message() });
        }
        return this.updateInfringement(infringement.infringementId, sanitisedDto);
    }

    @Transactional()
    // @LoggerMethod()
    async updateInfringement(
        id: number,
        dto: UpdateInfringementDto,
        nominationDto: NominationDto = {},
        canOverrideStatus: boolean = false,
    ): Promise<Infringement> {

        let infringement = await Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();
        if (isNil(infringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message() });
        }

        const statusUpdater = StatusUpdater.create().setSource(StatusUpdateSources.UpdateInfringement).setDto(dto);
        statusUpdater.setInitialInfringement(infringement);
        if (infringement.nomination) {
            statusUpdater.setInitialNomination(infringement.nomination);
        }

        
        dto.brn = !!dto.brn ? dto.brn.toString() : dto.brn;
        const newBrn = !!dto.brn && (!infringement.brn || infringement.brn.toString() !== dto.brn.toString());

        // If this is a new brn, then we want to save what the previous BRN was so that
        // we can perform the redirection later and it won't fail saying we're redirecting
        // to the same BRN.
        nominationDto.previousBrn = newBrn ? infringement.brn || 'null' : null;

        // Set approved date if set
        if (dto.approvedDate) {
            infringement.approvedDate = moment(dto.approvedDate).toISOString();
        }

        // Merge other keys
        infringement = merge(infringement, omit(omitNull(dto), ['noticeNumber', 'issuer']));
       

        if (dto.documentIds !== undefined) {
            if (!isNil(dto.documentIds) && dto.documentIds.length > 0) {
                const documents = await this.getDocumentService.getDocuments(dto.documentIds)
                infringement.document = documents.shift()
                infringement.extraDocuments = documents
            } else {
                infringement.document = null
                infringement.extraDocuments = []
            }
        }

        infringement.externalChangeDate = dto.isExternal ? moment().toISOString() : infringement.externalChangeDate;

        // Update location
        if (dto.streetNumber || dto.streetName || dto.country) {
            infringement.location = merge(infringement.location, dto);
            infringement.location.hasGoogleResult = false;
            infringement.location.formattedAddress = null;
        }

        // Check original amount
        infringement.originalAmount = await this.updateInfringementOriginalAmountService.updateOriginalAmount(infringement);

        // Check penalty amount
        infringement.penaltyAmount = await this.updateInfringementPenaltyAmountService.updatePenaltyAmount(infringement);
        infringement.nomination = await this.standardNominationRulesService.applyRules(infringement, infringement.nomination);
        await this.standardInfringementRulesService.applyRules(infringement);

        // Upsert infringement notes
        if (dto.notes || dto.note) {
            await this.upsertInfringementNoteService.upsertMultipleInfringementNotes(
                // Concatenate all of the notes and filter the nulls
                [dto.note].concat(dto.notes || []).filter((n) => n),
                null,
                infringement,
            );
            infringement.notes = await this.getInfringementNotesService.getInfringementNotesForInfringement(infringement.infringementId);
        }

        
        // Check if status is updating to Outstanding
        if (infringement.status === InfringementStatus.Outstanding) {
            this.logger.debug({
                message: 'Updating Infringement status to Outstanding',
                detail: {
                    id,
                    dto,
                    nominationDto,
                    canOverrideStatus,
                    infringement,
                },
                fn: this.updateInfringement.name,
            });
        }

        // Save changes
        try {
            statusUpdater.setFinalInfringement(infringement);
            if(infringement.nomination)
            {
                statusUpdater.setFinalNomination(infringement.nomination);
                await statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition().persist();
            }    
        } catch (e) {
            await this.saveNewInfringementLogJob.dispatchJob({
                infringementId: infringement.infringementId,
                type: LogType.Error,
                message: e.message,
            });
            databaseExceptionHelper(e, INFRINGEMENT_CONSTRAINTS, e.message);
        }

        try
        {
            if(NominationDto)
            {
                // If the offence date or the brn has changed, we need to relink the infringement to a contract
                // and update the nomination target
                if (this.linkingService.shouldRelink(dto)) {
                    await this.linkingService.linkInfringementContractAndResolveNomination(infringement, statusUpdater, nominationDto);
                }
            }
        }catch(e){}
        await Log.createAndSave({
            infringement,
            priority: LogPriority.High,
            type: LogType.Updated,
            message: 'Updated infringement successfully',
        });

        infringement.nomination = await this.redirectionParametersService.setRedirectionParameters(
            infringement.nomination,
            nominationDto,
            await Account.findByIdentifierOrId(nominationDto.redirectionIdentifier || infringement.nomination.rawRedirectionIdentifier),
            infringement,
            statusUpdater,
        );

        statusUpdater.setFinalNomination(infringement.nomination);
        statusUpdater.setFinalInfringement(infringement);

        statusUpdater.resolveStatusUpdates(canOverrideStatus).throwIfInvalidStatusTransition();
        await statusUpdater.persist();
        statusUpdater.logInfo();

        const finalInfringement = await Infringement.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :id', { id })
            .getOne();
        // cancel insertion of external payment
        //await this.externalPaymentService.upsertUsingNomination(finalInfringement, nominationDto);

        return finalInfringement;
    }
}