import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { UpsertInfringementDto, UpsertInfringementSpreadsheetDto } from '@modules/infringement/controllers/upsert-infringement.dto';
import {
    Client,
    Infringement,
    InfringementCreationMethod,
    RawInfringement,
    RawInfringementStatus,
    RawLocationParserHelper,
} from '@entities';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { plainToClass } from 'class-transformer';
import { merge } from 'lodash';
import { CreateInfringementService } from '@modules/infringement/services/create-infringement.service';
import { UpdateInfringementService } from '@modules/infringement/services/update-infringement.service';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpsertType } from '@modules/infringement/enums/upsert-type.enum';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { Config } from '@config/config';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { UpsertInfringementNoteService } from '@modules/infringement-note/services/upsert-infringement-note-service';

@Injectable()
export class UpsertInfringementService {
    constructor(
        private logger: Logger,
        private createInfringementService: CreateInfringementService,
        private updateInfringementService: UpdateInfringementService,
        private upsertInfringementNoteService: UpsertInfringementNoteService,
    ) {}

    async upsertBySpreadsheetDto(
        dto: UpsertInfringementSpreadsheetDto,
    ): Promise<{
        infringement: Infringement;
        type: UpsertType;
    }> {
        let sanitisedDto = omitNull(dto);
        if (sanitisedDto.rawAddress) {
            const locationSingleDto: UpdateLocationSingleDto = plainToClass(UpdateLocationSingleDto, dto);
            const mappedLocationDto: UpdateLocationDetailedDto = RawLocationParserHelper.parseUpdateDto(locationSingleDto);
            sanitisedDto = merge(sanitisedDto, mappedLocationDto);
        }

        return this.upsertInfringement(sanitisedDto);
    }

    async upsertInfringement(
        dto: UpsertInfringementDto,
        canOverrideStatus: boolean = false,
    ): Promise<{
        infringement: Infringement;
        type: UpsertType;
    }> {
        const infringement = await Infringement.findByNoticeNumberAndIssuer(dto.noticeNumber, dto.issuer).getOne();
        const updateDto = omitNull(plainToClass(UpdateInfringementDto, omitNull(dto), { strategy: 'excludeAll' }));
        const createDto = omitNull(plainToClass(CreateInfringementDto, omitNull(dto), { strategy: 'excludeAll' }));
        const nominationDto = omitNull(
            plainToClass(NominationDto, {
                redirectionCompletionDate: updateDto.dateRedirectionCompleted || createDto.dateRedirectionCompleted,
                redirectionIdentifier: updateDto.redirectionIdentifier || createDto.redirectionIdentifier,
                redirectionLetterSendDate: updateDto.redirectionLetterSendDate || createDto.redirectionLetterSendDate,
                setRedirectionIdentifier: updateDto.setRedirectionIdentifier || createDto.setRedirectionIdentifier,
                setRedirectionCompletionDate: updateDto.setRedirectionCompletionDate || createDto.setRedirectionCompletionDate,
                paymentAmount: updateDto.paymentAmount || createDto.paymentAmount,
                paymentDate: updateDto.paymentDate || createDto.paymentDate,
                paymentReference: updateDto.paymentReference || createDto.paymentReference,
                redirectionType: updateDto.redirectionType || createDto.redirectionType,
                redirectionReference: updateDto.redirectionReference || createDto.redirectionReference,
            }),
        );

        if (!infringement && canOverrideStatus) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message() });
        }

        // Format note into a partial InfringementNote for update infringement
        if (dto.note) {
            updateDto.notes = [dto.note];
        }

        return !!infringement
            ? this.updateInfringement(infringement, updateDto, nominationDto, canOverrideStatus)
            : this.createInfringement(createDto, nominationDto);
    }

    private async updateInfringement(
        infringement: Infringement,
        updateDto: UpdateInfringementDto,
        nominationDto: NominationDto,
        canOverrideStatus: boolean = false,
    ) {
        const rawInfringement = await RawInfringement.create({
            client: await Client.findByName(Config.get.infringement.infringementUploadClientName),
            data: {
                type: UpsertType.UPDATE,
                updateDto,
                nominationDto,
            },
        } as object).save();

        try {
            const updatedInfringement = await this.updateInfringementService.updateInfringement(
                infringement.infringementId,
                updateDto,
                nominationDto,
                canOverrideStatus,
            );
            const result = {
                infringement: updatedInfringement,
                type: UpsertType.UPDATE,
            };
            await rawInfringement.setStatus(RawInfringementStatus.Completed).setResult(updatedInfringement).save();
            return result;
        } catch (e) {
            await rawInfringement
                .setStatus(RawInfringementStatus.Failed)
                .setResult({
                    error: e.message,
                })
                .save();
            this.logger.error({
                message: `Failed to upload infringement: ${e.message}`,
                fn: this.updateInfringement.name,
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
            });
            throw e;
        }
    }

    private async createInfringement(createDto: CreateInfringementDto, nominationDto: NominationDto) {
        const rawInfringement = await RawInfringement.create({
            client: await Client.findByName(Config.get.infringement.infringementUploadClientName),
            data: {
                type: UpsertType.CREATE,
                createDto,
                nominationDto,
            },
        } as object).save();

        try {
            const createdInfringement = await this.createInfringementService.createInfringement(
                createDto,
                nominationDto,
                InfringementCreationMethod.ExcelUpload,
            );
            // Upsert infringement notes - infringement needs to be created and saved before linking a note
            if (createDto.note) {
                await this.upsertInfringementNoteService.upsertInfringementNote({ value: createDto.note }, null, createdInfringement);
            }
            const result = {
                infringement: createdInfringement,
                type: UpsertType.CREATE,
            };
            await rawInfringement.setStatus(RawInfringementStatus.Completed).setResult(createdInfringement).save();
            return result;
        } catch (e) {
            await rawInfringement
                .setStatus(RawInfringementStatus.Failed)
                .setResult({
                    error: e.message,
                })
                .save();
            this.logger.error({
                message: `Failed to create infringement: ${e.message}`,
                fn: this.createInfringement.name,
                detail: {
                    error: e.message,
                    stack: e.stack,
                    createDto,
                    nominationDto,
                },
            });
            throw e;
        }
    }
}
