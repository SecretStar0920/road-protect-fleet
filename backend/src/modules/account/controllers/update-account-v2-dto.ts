import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AccountDetails, AccountReporting, AccountRole, AccountType, RequestInformationDetails } from '@entities';
import { Transform, Type } from 'class-transformer';
import { capitalize, isNil } from 'lodash';
import { UpdatePhysicalLocationDto, UpdatePostalLocationDto } from '@modules/location/controllers/update-location-detailed-dto';
import { asString } from '@modules/shared/helpers/dto-transforms';

export class UpdateAccountV2Dto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The name of the group / business / company', example: 'Road Protect', required: false })
    name?: string;

    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The account identifier or BRN', example: '1237471931', required: false })
    identifier?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: 'The email address of the primary contact', required: false, example: 'person@roadprotect.co.il' })
    primaryContact?: string;

    @IsString()
    @IsOptional()
    @ApiHideProperty()
    type?: AccountType;

    @IsBoolean()
    @IsOptional()
    @Transform((val) => (isNil(val) ? val : false))
    // @ApiProperty({ description: 'Whether the account is verified by an admin or not', required: false, default: false, example: true })
    @ApiHideProperty()
    isVerified?: boolean;

    @IsBoolean()
    @IsOptional()
    // @ApiProperty({ description: 'Whether the account is managed on the system or not', required: false, default: false, example: true })
    @ApiHideProperty()
    managed?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => AccountDetails)
    details?: AccountDetails;

    @IsIn(Object.values(AccountRole))
    @IsOptional()
    @ApiProperty({
        description: 'The primary role of the account',
        enum: Object.values(AccountRole),
        required: false,
        example: AccountRole.Owner,
    })
    @Transform((val) => capitalize(val))
    role?: AccountRole;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'The document id for the power of attorney for this account', required: false, example: 123 })
    documentId?: number;

    @IsOptional()
    // @ApiProperty({
    //     description: 'This object contains fields used to customise infringement reports for an account',
    //     required: false,
    //     example: {
    //         receiveWeeklyReport: false,
    //         ccAddress: ['person@roadprotect.co.il'],
    //     },
    // })
    @ApiHideProperty()
    accountReporting?: AccountReporting;

    @ValidateNested()
    @Type(() => UpdatePhysicalLocationDto)
    physicalLocation?: UpdatePhysicalLocationDto;

    @ValidateNested()
    @Type(() => UpdatePostalLocationDto)
    postalLocation?: UpdatePostalLocationDto;

    @IsOptional()
    @ApiHideProperty()
    requestInformationDetails?: RequestInformationDetails;
}
