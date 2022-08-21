// Variable names based on crawler API
import { Trim } from '@modules/shared/helpers/trim.transform';
import { IsOptional, IsString } from 'class-validator';

export class TelavivRawInfringementDto {
    @IsString()
    @IsOptional()
    @Trim()
    // tslint:disable-next-line:variable-name
    fine_end_cust_id?: string;

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
    fine_action_date: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_street?: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_debit?: string;

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
    fine_trx_msg: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_pay_due_date?: string;

    @IsString()
    @Trim()
    // tslint:disable-next-line:variable-name
    issuer_code: string;

    @IsString()
    @Trim()
    @IsOptional()
    // tslint:disable-next-line:variable-name
    fine_note?: string;
}
