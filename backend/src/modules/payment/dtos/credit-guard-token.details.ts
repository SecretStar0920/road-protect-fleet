import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreditGuardTokenDetails {
    @IsOptional()
    @ApiProperty()
    uniqueID: string;
    @IsOptional()
    @ApiProperty()
    lang: string;
    @IsOptional()
    @ApiProperty()
    cardToken: string;
    @IsOptional()
    @ApiProperty()
    cardExp: string;
    @IsOptional()
    @ApiProperty()
    personalId: string;
    @IsOptional()
    @ApiProperty()
    cardMask: string;
    @IsOptional()
    @ApiProperty()
    txId: string;
    @IsOptional()
    @ApiProperty()
    authNumber: string;
    @IsOptional()
    @ApiProperty()
    numberOfPayments: string;
    @IsOptional()
    @ApiProperty()
    firstPayment: string;
    @IsOptional()
    @ApiProperty()
    periodicalPayment: string;
    @IsOptional()
    @ApiProperty()
    responseMAC: string;

    // Our added params
    @IsOptional()
    @ApiProperty()
    type: string;
}
