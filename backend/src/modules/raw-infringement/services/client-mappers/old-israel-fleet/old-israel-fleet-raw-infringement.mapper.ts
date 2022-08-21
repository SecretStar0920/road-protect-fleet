import { Config } from '@config/config';
import { Infringement, RawInfringement, RawLocationParserHelper, RedirectionType, Vehicle } from '@entities';
import { Logger } from '@logger';
import { CreateInfringementDto } from '@modules/infringement/controllers/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/controllers/update-infringement.dto';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { OldIsraelFleetRawInfringementValidityChecker } from '@modules/raw-infringement/services/client-mappers/old-israel-fleet/old-israel-fleet-raw-infringement-validity-checker';
import { RawInfringementMapper } from '@modules/raw-infringement/services/client-mappers/raw-infringement.mapper';
import { RawInfringementIdentifierService } from '@modules/raw-infringement/services/raw-infringement-identifier.service';
import { omitNull } from '@modules/shared/helpers/dto-transforms';
import { Trim } from '@modules/shared/helpers/trim.transform';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsOptional, IsString, validate } from 'class-validator';
import { isEmpty, isNil, merge } from 'lodash';
import * as moment from 'moment';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class OldIsraelFleetRawInfringementDto {
    // variable names determined by data obtained from old road protect
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_seq: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_id: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_veh_id: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_end_cust_id: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    cust_name: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_action_date: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_verify_date: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_pay_due_date: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_amount: string;
    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_debit?: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_amount_payed?: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_status: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_trx_msg?: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    city_name: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_street: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_branch: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_comments: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_import_date: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_trx_id?: string;
    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_status_date: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_transfer_date?: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_driver?: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_driver_charge?: string;
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_city?: string;
}

const oldIsraelFineStatusMapper = {
    1: 'פתוח',
    2: 'שולם',
    3: 'ערעור התקבל',
    4: 'כפל קנס',
    5: 'הסבה נשלחה לעירייה',
    6: 'מאושר לתשלום',
    7: 'סגור',
};

enum OldIsraelFineInvertedMapper {
    Open = 1,
    Paid = 2,
    'Appeal Accepted' = 3,
    'Double Payment' = 4,
    'Redirection' = 5,
    'Approved for Payment' = 6,
    Closed = 7,
}

export class OldIsraelFleetRawInfringementMapper extends RawInfringementMapper {
    private validityChecker: OldIsraelFleetRawInfringementValidityChecker;

    constructor(private logger: Logger) {
        super();
        this.validityChecker = new OldIsraelFleetRawInfringementValidityChecker(this.logger);
    }

    async getCreateInfringementDto(raw: RawInfringement): Promise<CreateInfringementDto> {
        const oldIsraelFleetFine: OldIsraelFleetRawInfringementDto = plainToClass(OldIsraelFleetRawInfringementDto, raw.data);
        const validationErrors = await validate(oldIsraelFleetFine);
        if (!isEmpty(validationErrors)) {
            this.logger.error({
                message: 'Invalid raw infringement data',
                detail: validationErrors,
                fn: this.getCreateInfringementDto.name,
            });
            throw new BadRequestException({ message: ERROR_CODES.E109_InvalidRawInfringementData.message() });
        }

        const vehicle = await Vehicle.findOneByRegistrationOrId(oldIsraelFleetFine.fine_veh_id);
        if (isNil(vehicle)) {
            throw new BadRequestException({
                message: ERROR_CODES.E049_CouldNotFindVehicle.message({ registration: oldIsraelFleetFine.fine_veh_id }),
            });
        }

        const createInfringementData: CreateInfringementDto = {
            country: 'ישראל',
            noticeNumber: oldIsraelFleetFine.fine_id,
            reason: oldIsraelFleetFine.fine_comments,
            reasonCode: oldIsraelFleetFine.fine_branch,
            issuer: this.extractIssuer(oldIsraelFleetFine),
            issuerStatus: oldIsraelFineStatusMapper[oldIsraelFleetFine.fine_status],
            vehicle: oldIsraelFleetFine.fine_veh_id,
            amountDue: this.getInfringementAmountDue(oldIsraelFleetFine),
            originalAmount: this.getInfringementOriginalAmount(oldIsraelFleetFine),
            offenceDate: oldIsraelFleetFine.fine_action_date,
            latestPaymentDate: oldIsraelFleetFine.fine_pay_due_date,
            brn: oldIsraelFleetFine.fine_end_cust_id,
            city: oldIsraelFleetFine.city_name,
            timezone: Config.get.oldFleetSystemConfig.timezone,
            isExternal: true,
            redirectionType: RedirectionType.External,
        };

        let createInfringementDto: CreateInfringementDto = plainToClass(CreateInfringementDto, omitNull(createInfringementData));
        if (isNil(oldIsraelFleetFine.fine_street)) {
            return createInfringementDto;
        }

        const dto: CreateLocationSingleDto = {
            country: 'ישראל',
            rawAddress: oldIsraelFleetFine.fine_street,
            city: oldIsraelFleetFine.city_name,
        };

        const locationSingleDto: CreateLocationSingleDto = plainToClass(CreateLocationSingleDto, dto);

        const mappedLocationDto: CreateLocationDetailedDto = RawLocationParserHelper.parseCreateDto(locationSingleDto);
        createInfringementDto = merge(createInfringementDto, mappedLocationDto);

        return createInfringementDto;
    }

    private getInfringementOriginalAmount(oldIsraelFleetFine: OldIsraelFleetRawInfringementDto) {
        if (!isNil(oldIsraelFleetFine.fine_amount)) {
            return oldIsraelFleetFine.fine_amount;
        }

        // Check to see if it was paid and if it was then how much was paid.
        // If the fine amount is missing then it's likely that this would be the
        // way to figure out how much the fine actually was.
        if (
            (oldIsraelFleetFine.fine_status || '').toString() === OldIsraelFineInvertedMapper.Paid.toString() &&
            !isNil(oldIsraelFleetFine.fine_amount_payed)
        ) {
            return oldIsraelFleetFine.fine_amount_payed;
        }

        // At this point we have a problem because the infringement is going to
        // fail. So as a last ditch effort, we're going to take the debit amount
        // which could include penalties. A meeting on 2020-10-21 with Arik, Ore
        // and Isaac confirmed that this would not cause major problems and this
        // will at least allow us to create those infringements.
        if (!isNil(oldIsraelFleetFine.fine_debit)) {
            return oldIsraelFleetFine.fine_debit;
        }

        return null;
    }

    private getInfringementAmountDue(oldIsraelFleetFine: OldIsraelFleetRawInfringementDto) {
        // Take fine debit for amount due if it exists
        if (!isNil(oldIsraelFleetFine.fine_debit)) {
            return oldIsraelFleetFine.fine_debit;
        }

        // Otherwise take original amount
        if (!isNil(oldIsraelFleetFine.fine_amount)) {
            return oldIsraelFleetFine.fine_amount;
        }

        // If we get here, check if the fine is paid and assume amount due is 0
        // Check to see if it was paid and if it was then how much was paid.
        if (
            (oldIsraelFleetFine.fine_status || '').toString() === OldIsraelFineInvertedMapper.Paid.toString() &&
            !isNil(oldIsraelFleetFine.fine_amount_payed)
        ) {
            return '0';
        }

        return null;
    }

    private extractIssuer(oldIsraelFleetFine: OldIsraelFleetRawInfringementDto): string {
        const issuerCode = RawInfringementIdentifierService.extractIssuerCodeFromFineSeq(oldIsraelFleetFine) || '0';
        // Issuer code takes priority. However, there is a bug where the code is
        // sometimes zero and in this case an error is now thrown
        if (issuerCode.toString() === '0') {
            throw new BadRequestException({ message: ERROR_CODES.E110_InvalidIssuerCode.message(), context: oldIsraelFleetFine });
        }

        return issuerCode;
    }

    async isExistingInfringement(raw: RawInfringement): Promise<{ infringementId: number; exists: boolean }> {
        const oldIsraelFleetFine: OldIsraelFleetRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!oldIsraelFleetFine) {
            return;
        }

        const issuerCodeOrName = this.extractIssuer(oldIsraelFleetFine);
        const infringement = await Infringement.findByNoticeNumberAndIssuer(oldIsraelFleetFine.fine_id, issuerCodeOrName).getOne();
        const exists = !isNil(infringement);

        if (exists) {
            return { infringementId: infringement.infringementId, exists: true };
        } else {
            return { infringementId: null, exists: false };
        }
    }

    async getUpdateInfringementDto(raw: RawInfringement): Promise<{ dto: UpdateInfringementDto; perform: boolean; additional?: any }> {
        const oldIsraelFleetFine: OldIsraelFleetRawInfringementDto = await this.getRawInfringementDto(raw);
        if (!oldIsraelFleetFine) {
            return;
        }

        const infringement = await Infringement.findByNoticeNumberAndIssuer(
            oldIsraelFleetFine.fine_id,
            this.extractIssuer(oldIsraelFleetFine),
        ).getOne();

        if (isNil(infringement)) {
            this.logger.error({
                message: 'Cannot update infringement that does not exist',
                detail: oldIsraelFleetFine,
                fn: this.getUpdateInfringementDto.name,
            });
            return { dto: null, perform: false, additional: { message: 'Tried to update, but could not find infringement' } };
        }

        // Check if outdated
        const isValid = await this.validityChecker.isValid(oldIsraelFleetFine);
        if (!isValid) {
            this.logger.warn({
                message: 'Fine data is outdated, Not updating infringement',
                detail: oldIsraelFleetFine,
                fn: this.getUpdateInfringementDto.name,
            });
            const fineDate = moment(oldIsraelFleetFine.fine_verify_date);
            const infringementUpdatedDate = moment(infringement.updatedAt);
            const infringementCreatedDate = moment(infringement.createdAt);
            return {
                dto: null,
                perform: false,
                additional: {
                    message: 'No update performed due to outdated information',
                    detail: { fineDate, infringementCreatedDate, infringementUpdatedDate },
                },
            };
        }

        const updateInfringementData: UpdateInfringementDto = {
            noticeNumber: oldIsraelFleetFine.fine_id,
            issuer: this.extractIssuer(oldIsraelFleetFine),
            issuerStatus: oldIsraelFineStatusMapper[oldIsraelFleetFine.fine_status],
            amountDue: this.getInfringementAmountDue(oldIsraelFleetFine),
            originalAmount: this.getInfringementOriginalAmount(oldIsraelFleetFine),
            offenceDate: oldIsraelFleetFine.fine_action_date,
            latestPaymentDate: oldIsraelFleetFine.fine_pay_due_date,
            brn: oldIsraelFleetFine.fine_end_cust_id,
            city: oldIsraelFleetFine.city_name,
            isExternal: true,
        };

        let updateInfringementDto: UpdateInfringementDto = plainToClass(UpdateInfringementDto, omitNull(updateInfringementData));

        if (isNil(oldIsraelFleetFine.fine_street)) {
            return { dto: updateInfringementDto, perform: true };
        }

        const dto: UpdateLocationSingleDto = {
            rawAddress: oldIsraelFleetFine.fine_street,
            city: oldIsraelFleetFine.city_name,
        };

        const locationSingleDto: UpdateLocationSingleDto = plainToClass(UpdateLocationSingleDto, dto);
        const mappedLocationDto: UpdateLocationDetailedDto = RawLocationParserHelper.parseUpdateDto(locationSingleDto);
        updateInfringementDto = merge(updateInfringementDto, mappedLocationDto);

        return { dto: updateInfringementDto, perform: true };
    }

    async getNominationDtoFromRawInfringement(raw: RawInfringement): Promise<NominationDto> {
        return {};
    }

    private async getRawInfringementDto(raw: RawInfringement): Promise<OldIsraelFleetRawInfringementDto> {
        const oldIsraelFleetFine: OldIsraelFleetRawInfringementDto = plainToClass(OldIsraelFleetRawInfringementDto, raw.data);
        const validationErrors = await validate(oldIsraelFleetFine);
        if (!isEmpty(validationErrors)) {
            this.logger.error({
                message: 'Invalid raw infringement data',
                detail: validationErrors,
                fn: this.getUpdateInfringementDto.name,
            });
            return null;
        }

        return oldIsraelFleetFine;
    }
}
