import { RawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/raw-infringement.mapper';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { Logger } from '@logger';
import { Infringement, Issuer, RawInfringement, RawLocationParserHelper, RedirectionType } from '@entities';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { plainToClass } from 'class-transformer';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { isEmpty, isNil, merge } from 'lodash';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { IssuerIntegrationType } from '@modules/shared/models/issuer-integration-details.model';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { City4uRawInfringementDto } from '@integrations/crawlers/city4u/city4u-raw-infringement.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

/**
 * This is based on the map status function in the city4u crawler-api code
 */
const city4uFineStatusMapper = {
    1: 'פתוח',
    2: 'שולם',
    7: 'סגור',
};

export class City4uRawInfringementMapper extends RawInfringementMapper {
    private issuersIntegration = new GetIssuerExternalCodeService();
    constructor(private logger: Logger) {
        super();
    }
    async getCreateInfringementDto(raw: RawInfringement): Promise<CreateInfringementDto> {
        const fine = await this.getRawInfringementDto(raw);
        const issuer = await this.getIssuer(fine.issuer_code);

        const createInfringementData: CreateInfringementDto = {
            country: 'ישראל',
            noticeNumber: fine.fine_id,
            reason: fine.fine_comments,
            issuer: issuer.code,
            issuerStatus: city4uFineStatusMapper[fine.fine_status],
            vehicle: fine.fine_veh_id,
            brn: fine.fine_end_cust_id,
            amountDue: fine.fine_debit,
            originalAmount: fine.fine_amount,
            offenceDate: fine.fine_action_date,
            latestPaymentDate: fine.fine_pay_due_date ? fine.fine_pay_due_date : null,
            city: issuer.name,
            timezone: 'Asia/Jerusalem',
            isExternal: true,
            redirectionType: RedirectionType.External,
            note: fine.fine_note,
        };

        let createInfringementDto: CreateInfringementDto = plainToClass(CreateInfringementDto, omitNull(createInfringementData));

        if (isNil(fine.fine_street)) {
            return createInfringementDto;
        }

        const dto: CreateLocationSingleDto = {
            country: 'ישראל',
            rawAddress: fine.fine_street,
            city: issuer.name,
        };

        const locationSingleDto: CreateLocationSingleDto = plainToClass(CreateLocationSingleDto, dto);

        const mappedLocationDto: CreateLocationDetailedDto = RawLocationParserHelper.parseCreateDto(locationSingleDto);
        createInfringementDto = merge(createInfringementDto, mappedLocationDto);

        return createInfringementDto;
    }

    async getUpdateInfringementDto(raw: RawInfringement): Promise<{ dto: UpdateInfringementDto; perform: boolean; additional?: any }> {
        const fine = await this.getRawInfringementDto(raw);
        const issuer = await this.getIssuer(fine.issuer_code);
        const infringement = await Infringement.findByNoticeNumberAndIssuer(fine.fine_id, issuer.code).getOne();
        if (isNil(infringement)) {
            this.logger.error({
                message: 'Cannot update infringement that does not exist',
                detail: fine,
                fn: this.getUpdateInfringementDto.name,
            });
            return { dto: null, perform: false, additional: { message: 'Tried to update, but could not find infringement' } };
        }

        // TODO: Do we need to run a validity checker as in the old israel fleet raw infringement mapper?

        const updateInfringementData: UpdateInfringementDto = {
            noticeNumber: fine.fine_id,
            reason: fine.fine_comments,
            issuer: issuer.code,
            brn: fine.fine_end_cust_id,
            issuerStatus: city4uFineStatusMapper[fine.fine_status],
            amountDue: fine.fine_debit,
            latestPaymentDate: fine.fine_pay_due_date ? fine.fine_pay_due_date : null,
            offenceDate: fine.fine_action_date,
            city: issuer.name,
            timezone: 'Asia/Jerusalem',
            isExternal: true,
            note: fine.fine_note,
        };

        let updateInfringementDto: UpdateInfringementDto = plainToClass(UpdateInfringementDto, omitNull(updateInfringementData));

        if (isNil(fine.fine_street)) {
            return { dto: updateInfringementDto, perform: true };
        }

        const dto: UpdateLocationSingleDto = {
            country: 'ישראל',
            rawAddress: fine.fine_street,
            city: issuer.name,
        };

        const locationSingleDto: UpdateLocationSingleDto = plainToClass(UpdateLocationSingleDto, dto);
        const mappedLocationDto: UpdateLocationDetailedDto = RawLocationParserHelper.parseUpdateDto(locationSingleDto);
        updateInfringementDto = merge(updateInfringementDto, mappedLocationDto);

        return { dto: updateInfringementDto, perform: true };
    }

    async isExistingInfringement(raw: RawInfringement): Promise<{ infringementId: number; exists: boolean }> {
        const fine = await this.getRawInfringementDto(raw);
        const issuer = await this.getIssuer(fine.issuer_code);
        const infringement = await Infringement.findByNoticeNumberAndIssuer(fine.fine_id, issuer.code).getOne();
        const exists = !isNil(infringement);
        if (exists) {
            return { infringementId: infringement.infringementId, exists: true };
        } else {
            return { infringementId: null, exists: false };
        }
    }

    private async getIssuer(externalIssuerCode: string): Promise<Issuer> {
        return this.issuersIntegration.getIssuerByExternalCodeAndType(externalIssuerCode, IssuerIntegrationType.City4u);
    }

    private async getRawInfringementDto(raw: RawInfringement): Promise<City4uRawInfringementDto> {
        const fine: City4uRawInfringementDto = plainToClass(City4uRawInfringementDto, raw.data);
        const validationErrors = await validate(fine);
        if (!isEmpty(validationErrors)) {
            this.logger.error({ message: 'Invalid raw infringement data', detail: validationErrors, fn: this.getRawInfringementDto.name });
            throw new BadRequestException({
                message: ERROR_CODES.E109_InvalidRawInfringementData.message(),
                detail: validationErrors,
            });
        }
        return fine;
    }

    async getNominationDtoFromRawInfringement(raw: RawInfringement): Promise<NominationDto> {
        return Promise.resolve(undefined);
    }
}
