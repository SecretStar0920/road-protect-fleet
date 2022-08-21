import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AccountReporting, AccountRole, AccountType } from '@entities';
import { Transform } from 'class-transformer';
import { capitalize, isNil } from 'lodash';
import { UpdateLocationDetailedDto } from '@modules/location/controllers/update-location-detailed-dto';
import { asString } from '@modules/shared/helpers/dto-transforms';

export class UpdateAccountV1Dto extends UpdateLocationDetailedDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The name of the group / business / company', example: 'Road Protect', required: false })
    name?: string;

    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The account identifier or BRN', example: '1237471931', required: false })
    identifier?: string;

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

    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: 'The email address of the primary contact', required: false, example: 'person@roadprotect.co.il' })
    primaryContact?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The name of the primary contact for this account', required: false, example: 'Sarah Jones' })
    contactName?: string;

    @IsOptional()
    @IsString()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The phone of the primary contact for this account', required: false, example: '(410) 282-9236' })
    contactTelephone?: string;

    @IsOptional()
    @IsString()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The fax of the primary contact for this account', required: false, example: '+1 323 555 1234' })
    contactFax?: string;

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
}
