import { Infringement, RawInfringement, RedirectionType } from '@entities';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { Logger } from '@logger';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { AtgRawInfringementDto } from '@modules/raw-infringement/services/client-mappers/atg/atg-raw-infringement.dto';
import { RawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/raw-infringement.mapper';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { get, isEmpty, isNil } from 'lodash';

export class AtgRawInfringementMapper extends RawInfringementMapper {
    private issuersIntegration = new AtgIssuers();

    constructor(protected logger: Logger) {
        super();
    }

    /**
     * Get create infringement dto
     */
    async getCreateInfringementDto(raw: RawInfringement): Promise<CreateInfringementDto> {
        const atgInfringement: AtgRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!atgInfringement) {
            return;
        }
        return this.getCreateInfringementDtoFromRawDto(atgInfringement);
    }

    /**
     * Shared function to get create infringement dto from typed raw dto
     * @param atgInfringement
     * @protected
     */
    protected async getCreateInfringementDtoFromRawDto(atgInfringement: AtgRawInfringementDto): Promise<CreateInfringementDto> {
        const issuer = await this.issuersIntegration.getIssuerByATGCode(atgInfringement.customer);

        const createInfringementData: CreateInfringementDto = {
            noticeNumber: atgInfringement.ticketNumber,
            reason: atgInfringement.description,
            reasonCode: atgInfringement.localLawNumber,
            issuer: get(issuer, 'code'),
            vehicle: atgInfringement.carNumber,
            amountDue: this.getInfringementAmountDue(atgInfringement),
            originalAmount: this.getInfringementOriginalAmount(atgInfringement),
            offenceDate: atgInfringement.dtViolationTime,
            latestPaymentDate: atgInfringement.lastDateToPay ? atgInfringement.lastDateToPay : null,
            streetName: atgInfringement.streetName,
            streetNumber: atgInfringement.houseNumber,
            proximity: atgInfringement.violationNearTo,
            city: get(issuer, 'name'),
            country: 'ישראל',
            isExternal: true,
            redirectionType: RedirectionType.External,
        };
        const createInfringementDto: CreateInfringementDto = plainToClass(CreateInfringementDto, omitNull(createInfringementData));
        const infringementValidationErrors = validate(createInfringementDto);
        if (!isEmpty(infringementValidationErrors)) {
            this.logger.error({
                message: 'Invalid create infringement data',
                detail: infringementValidationErrors,
                fn: this.getCreateInfringementDto.name,
            });
            return;
        }
        return createInfringementData;
    }

    /**
     * Check if existing infringement
     * @param raw
     */
    async isExistingInfringement(raw: RawInfringement): Promise<{ exists: boolean; infringementId: number }> {
        const atgInfringement: AtgRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!atgInfringement) {
            return;
        }
        return this.isExistingInfringementFromRawDto(atgInfringement);
    }

    /**
     * Shared function to check if existing infringement from typed raw dto
     * @param atgInfringement
     */
    protected async isExistingInfringementFromRawDto(
        atgInfringement: AtgRawInfringementDto,
    ): Promise<{ exists: boolean; infringementId: number }> {
        const infringement = await Infringement.findByNoticeNumberAndIssuer(
            atgInfringement.ticketNumber,
            await this.issuersIntegration.getIssuerCodeByATGCode(atgInfringement.customer),
        ).getOne();
        const exists = !isNil(infringement);

        if (exists) {
            return { infringementId: infringement.infringementId, exists: true };
        } else {
            return { infringementId: null, exists: false };
        }
    }

    /**
     * WARNING: This function is specifically used to reprocess raw infringements from ATG. Use with caution.
     */
    async getUpdateInfringementDto(raw: RawInfringement): Promise<{ dto: UpdateInfringementDto; perform: boolean; additional?: any }> {
        const atgInfringement: AtgRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!atgInfringement) {
            return;
        }
        return this.getUpdateInfringementDtoFromRawDto(atgInfringement);
    }

    /**
     * Shared function to get update infringement dto from typed raw dto
     * @param atgInfringement
     */
    protected async getUpdateInfringementDtoFromRawDto(
        atgInfringement: AtgRawInfringementDto,
    ): Promise<{ dto: UpdateInfringementDto; perform: boolean; additional?: any }> {
        const issuer = await this.issuersIntegration.getIssuerByATGCode(atgInfringement.customer);

        const updateInfringementData: UpdateInfringementDto = {
            noticeNumber: atgInfringement.ticketNumber,
            reason: atgInfringement.description,
            reasonCode: atgInfringement.localLawNumber,
            issuer: get(issuer, 'code'),
            amountDue: this.getInfringementAmountDue(atgInfringement),
            originalAmount: this.getInfringementOriginalAmount(atgInfringement),
            offenceDate: atgInfringement.dtViolationTime,
            latestPaymentDate: atgInfringement.lastDateToPay ? atgInfringement.lastDateToPay : null,
            streetName: atgInfringement.streetName,
            streetNumber: atgInfringement.houseNumber,
            proximity: atgInfringement.violationNearTo,
            city: get(issuer, 'name'),
            country: 'ישראל',
            isExternal: true,
            redirectionType: RedirectionType.External,
        };
        const updateInfringementDto: UpdateInfringementDto = plainToClass(UpdateInfringementDto, omitNull(updateInfringementData));
        const infringementValidationErrors = validate(updateInfringementDto);
        if (!isEmpty(infringementValidationErrors)) {
            this.logger.error({
                message: 'Invalid update infringement data',
                detail: infringementValidationErrors,
                fn: this.getCreateInfringementDto.name,
            });
            return;
        }
        return { dto: updateInfringementDto, perform: true };
    }

    private getInfringementOriginalAmount(atgFine: AtgRawInfringementDto) {
        if (!isNil(atgFine.amount)) {
            return atgFine.amount;
        }

        // Similar logic to old fleet system where just trying to set something then
        if (!isNil(atgFine.penaltyAmount)) {
            return atgFine.penaltyAmount;
        }

        return null;
    }

    private getInfringementAmountDue(atgFine: AtgRawInfringementDto) {
        // Take penalty amount for amount due if it exists
        if (!isNil(atgFine.penaltyAmount)) {
            return atgFine.penaltyAmount;
        }

        // Otherwise take original amount
        if (!isNil(atgFine.amount)) {
            return atgFine.amount;
        }

        // If we get here, we don't know whether or not the fine is paid so leave it

        return null;
    }

    async getNominationDtoFromRawInfringement(raw: RawInfringement): Promise<NominationDto> {
        return Promise.resolve(undefined);
    }

    protected async getRawInfringementDto(raw: RawInfringement): Promise<AtgRawInfringementDto> {
        const atgInfringement: AtgRawInfringementDto = plainToClass(AtgRawInfringementDto, raw.data);
        const validationErrors = await validate(atgInfringement);
        if (!isEmpty(validationErrors)) {
            this.logger.error({
                message: 'Invalid raw infringement data',
                detail: validationErrors,
                fn: this.getRawInfringementDto.name,
            });
            return;
        }
        return atgInfringement;
    }
}
