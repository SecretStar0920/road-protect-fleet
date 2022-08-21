import { RawInfringement } from '@entities';
import { AtgVerifyIntegrationRawInfringementDto } from '@integrations/automation/models/atg-ticket-details.model';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { AtgRawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/atg/atg-raw-infringement.mapper';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

// Currently the ATG Verification Mapper uses the exact same processors as the ATG raw infringement mapper
// Later we may have additional logic to process the extra fields that come from the verification endpoint
export class AtgVerificationRawInfringementMapper extends AtgRawInfringementMapper {
    async getCreateInfringementDto(raw: RawInfringement): Promise<CreateInfringementDto> {
        const atgInfringement: AtgVerifyIntegrationRawInfringementDto = await this.getRawInfringementDto(raw);
        return this.getCreateInfringementDtoFromRawDto(atgInfringement);
    }

    async isExistingInfringement(raw: RawInfringement): Promise<{ exists: boolean; infringementId: number }> {
        const atgInfringement: AtgVerifyIntegrationRawInfringementDto = await this.getRawInfringementDto(raw);
        return super.isExistingInfringementFromRawDto(atgInfringement);
    }

    async getUpdateInfringementDto(raw: RawInfringement): Promise<{ dto: UpdateInfringementDto; perform: boolean; additional?: any }> {
        const atgInfringement: AtgVerifyIntegrationRawInfringementDto = await this.getRawInfringementDto(raw);
        const updateObject = await super.getUpdateInfringementDtoFromRawDto(atgInfringement);

        if (atgInfringement.driverIdNumber && updateObject.perform) {
            updateObject.dto.brn = atgInfringement.driverIdNumber;
        }
        return updateObject;
    }

    async getNominationDtoFromRawInfringement(raw: RawInfringement): Promise<NominationDto> {
        const atgInfringement: AtgVerifyIntegrationRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!atgInfringement) {
            return {};
        }
        const nominationData: NominationDto = {
            redirectionIdentifier: atgInfringement.driverIdNumber,
            redirectionCompletionDate: atgInfringement.driverIdNumber ? moment().toISOString() : null,
        };

        return plainToClass(NominationDto, omitNull(nominationData));
    }

    /**
     * ATG Verify Endpoint returns the amount due and penalty amounts swapped to the original ATG endpoint
     * ie amountDue is in amount
     * and the original amount is the penalty amount
     * @param atgInfringement
     * @private
     */
    private fixAmountDue(atgInfringement: AtgVerifyIntegrationRawInfringementDto): AtgVerifyIntegrationRawInfringementDto {
        const amountDue = atgInfringement.amount;
        const originalAmount = atgInfringement.penaltyAmount;
        atgInfringement.penaltyAmount = amountDue;
        atgInfringement.amount = originalAmount;
        return atgInfringement;
    }

    protected async getRawInfringementDto(raw: RawInfringement): Promise<AtgVerifyIntegrationRawInfringementDto> {
        let atgInfringement: AtgVerifyIntegrationRawInfringementDto = plainToClass(AtgVerifyIntegrationRawInfringementDto, raw.data);
        const validationErrors = await validate(atgInfringement);
        if (!isEmpty(validationErrors)) {
            this.logger.error({
                message: 'Invalid raw infringement data',
                detail: validationErrors,
                fn: this.getRawInfringementDto.name,
            });
            throw new BadRequestException({
                message: ERROR_CODES.E109_InvalidRawInfringementData.message(),
                detail: validationErrors,
            });
        }
        atgInfringement = this.fixAmountDue(atgInfringement);
        return atgInfringement;
    }
}
