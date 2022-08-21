import { CreditGuardTokenDetails } from '@modules/payment/dtos/credit-guard-token.details';
import { IsOptional } from 'class-validator';

export class CreditGuardFailureParamsDto extends CreditGuardTokenDetails {
    @IsOptional()
    errorCode: string;
    @IsOptional()
    errorText: string;
}
