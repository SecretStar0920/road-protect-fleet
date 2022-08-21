// Variable names based on crawler API
import { Trim } from '@modules/shared/helpers/trim.transform';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { InfringementNote } from '@entities';

export class PoliceRawInfringementDto {
    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_end_cust_id?: string;

    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_id: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_veh_id?: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_action_date?: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_street?: string;

    @IsString()
    @Trim()
    @Transform((value) => value.replace(',', ''))
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_amount?: string;

    @IsString()
    @Trim()
    @Transform((value) => value.replace(',', ''))
    @ValidateIf((obj) => obj.fine_status !== '2')
    // tslint:disable-next-line:variable-name
    fine_debit: string;

    @IsString()
    @Trim()
    @Transform((value) => value.replace(',', ''))
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_extra_charge?: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_comments?: string;

    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_status: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_trx_msg?: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_pay_due_date?: string;

    @IsString()
    // tslint:disable-next-line:variable-name
    issuer_code: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_note?: string;
}
