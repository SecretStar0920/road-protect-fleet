import { IsString } from 'class-validator';
import { Trim } from '@modules/shared/helpers/trim.transform';

export class RawContractOcrDto {
    @IsString()
    @Trim()
    contract: string;

    @IsString()
    @Trim()
    customer: string;

    @IsString()
    @Trim()
    owner: string;

    @IsString()
    @Trim()
    car: string;

    @IsString()
    @Trim()
    start: string;

    @IsString()
    @Trim()
    end: string;
}
