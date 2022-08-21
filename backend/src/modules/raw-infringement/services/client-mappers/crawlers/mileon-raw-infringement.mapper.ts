import { Account, Infringement, Issuer, RawInfringement, RawLocationParserHelper, RedirectionType } from '@entities';
import { MileonRawInfringementDto } from '@integrations/crawlers/mileon/mileon-raw-infringement.dto';
import { Logger } from '@logger';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { RawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/raw-infringement.mapper';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { IssuerIntegrationType } from '@modules/shared/models/issuer-integration-details.model';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { isEmpty, isNil, merge } from 'lodash';
import * as moment from 'moment';

/**
 * This is based on the map status function in the mileon crawler-api code
 */
const mileonFineStatusMapper = {
    1: 'פתוח',
    2: 'שולם',
    7: 'סגור',
};

export class MileonRawInfringementMapper extends RawInfringementMapper {
    private issuersIntegration = new GetIssuerExternalCodeService();
    constructor(private logger: Logger) {
        super();
    }

    async getCreateInfringementDto(raw: RawInfringement): Promise<CreateInfringementDto> {
        const fine = await this.getRawInfringementDto(raw);
        const issuer = await this.getIssuer(fine.issuer_code);
        const account = await this.getAccount(fine);

        const createInfringementData: CreateInfringementDto = {
            country: 'ישראל',
            noticeNumber: fine.fine_id,
            reason: fine.fine_comments,
            issuer: issuer.code,
            issuerStatus: mileonFineStatusMapper[fine.fine_status],
            vehicle: fine.fine_veh_id,
            amountDue: this.getAmountDue(fine),
            originalAmount: fine.fine_debit,
            offenceDate: fine.fine_action_date,
            brn: fine.fine_end_cust_id,
            city: issuer.name,
            latestPaymentDate: fine.fine_pay_due_date,
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

        const account = await this.getAccount(fine);
        const updateInfringementData: UpdateInfringementDto = {
            noticeNumber: fine.fine_id,
            reason: fine.fine_comments,
            issuer: issuer.code,
            issuerStatus: mileonFineStatusMapper[fine.fine_status],
            amountDue: this.getAmountDue(fine),
            offenceDate: fine.fine_action_date,
            brn: fine.fine_end_cust_id,
            city: issuer.name,
            latestPaymentDate: fine.fine_pay_due_date,
            timezone: 'Asia/Jerusalem',
            isExternal: true,
            redirectionType: RedirectionType.External,
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
        this.logger.debug({
            message: 'Determining if the infringement exists',
            fn: this.isExistingInfringement.name,
            detail: { fine: fine.fine_id, issuer: issuer.code },
        });
        const infringement = await Infringement.findByNoticeNumberAndIssuer(fine.fine_id, issuer.code).getOne();
        const exists = !isNil(infringement);
        if (exists) {
            return { infringementId: infringement.infringementId, exists: true };
        } else {
            return { infringementId: null, exists: false };
        }
    }

    private async getIssuer(externalIssuerCode: string): Promise<Issuer> {
        return this.issuersIntegration.getIssuerByExternalCodeAndType(externalIssuerCode, IssuerIntegrationType.Mileon);
    }

    private async getAccount(fine: MileonRawInfringementDto): Promise<Account> {
        if (fine.fine_end_cust_id || fine.fine_end_cust_name) {
            // Either customer identifier is set or the customer name must be used
            const accountIdentifier = fine.fine_end_cust_id ? fine.fine_end_cust_id : fine.fine_end_cust_name;

            // Have to account for escaped characters (so remove escape \ character)
            const cleanedAccountIdentifier = accountIdentifier.replace('\\', '');
            return Account.findOneByIdOrNameOrIdentifier(cleanedAccountIdentifier);
        }
        return null;
    }

    private getAmountDue(fine: MileonRawInfringementDto): string {
        return fine.fine_debit ? fine.fine_debit : fine.fine_status === '2' ? '0.00' : null;
    }

    private async getRawInfringementDto(raw: RawInfringement): Promise<MileonRawInfringementDto> {
        const fine: MileonRawInfringementDto = plainToClass(MileonRawInfringementDto, raw.data);

        // Removing validation as there are a high number of cases where some data comes in with missing fields
        // const validationErrors = await validate(fine);
        // if (!isEmpty(validationErrors)) {
        //     this.logger.error({ message: 'Invalid raw infringement data', detail: validationErrors, fn: this.getRawInfringementDto.name });
        //     throw new BadRequestException({
        //         message: 'Invalid raw infringement data',
        //         detail: validationErrors,
        //     });
        // }
        return fine;
    }

    async getNominationDtoFromRawInfringement(raw: RawInfringement): Promise<NominationDto> {
        const fine: MileonRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!fine) {
            return {};
        }

        const account = await this.getAccount(fine);
        const nominationData: NominationDto = {
            redirectionIdentifier: account?.identifier,
            redirectionCompletionDate: account?.identifier ? moment().toISOString() : null,
        };

        return plainToClass(NominationDto, omitNull(nominationData));
    }
}
