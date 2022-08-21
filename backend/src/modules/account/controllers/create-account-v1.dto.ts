import { IsBoolean, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { asString } from '@modules/shared/helpers/dto-transforms';
import { capitalize, isNil } from 'lodash';
import { AccountReporting, AccountRole } from '@entities';
import { CreateLocationDetailedDto } from '@modules/location/controllers/create-location-detailed.dto';

export class CreateAccountV1Dto extends CreateLocationDetailedDto {
    @IsString()
    @ApiProperty({ description: 'The name of the group / business / company', example: 'Road Protect' })
    name: string;

    @IsString()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The identifier or business registration of the account', example: '721360279' })
    identifier: string;

    @IsBoolean()
    @IsOptional()
    @Transform((val) => (isNil(val) ? val : false))
    // @ApiProperty({ description: 'Whether the account is verified or not', required: false })
    @ApiHideProperty()
    isVerified?: boolean;

    @IsEmail()
    @ApiProperty({ description: 'The email address of the primary contact for this account', example: 'admin@roadprotect.co.il' })
    @IsOptional()
    primaryContact: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The given name of the primary contact for this account', required: false, example: 'John Doe' })
    contactName?: string;

    @IsOptional()
    @IsString()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The phone number of the primary contact for this account', required: false, example: '(410) 282-9236' })
    contactTelephone?: string;

    @IsOptional()
    @IsString()
    @Transform((val) => asString(val))
    @ApiProperty({ description: 'The fax number of the primary contact for this account', required: false, example: '+1 323 555 1234' })
    contactFax?: string;

    @IsIn(Object.values(AccountRole))
    @ApiProperty({
        description:
            'The primary role of the account, whether it functions primarily as a vehicle owner [Owner], user [User] or both [Hybrid]',
        enum: Object.values(AccountRole),
        example: 'Owner',
    })
    @Transform((val) => capitalize(val))
    role: AccountRole;

    @IsOptional()
    // @ApiProperty({
    //     description: 'This object contains fields used to customise infringement reports for an account',
    //     required: false,
    //     example: {
    //         receiveWeeklyReport: true,
    //         ccAddress: ['person@roadprotect.co.il'],
    //     },
    // })
    @ApiHideProperty()
    accountReporting?: AccountReporting;
}
