import { IsDefined, IsInt, IsOptional, IsString } from 'class-validator';
import { CreditGuardIntegrationType } from '@integrations/credit-guard/credit-guard.integration';
import { Type } from 'class-transformer';

export class PaymentCvvDetails {
    @IsOptional()
    @IsString()
    [CreditGuardIntegrationType.ATG]: string;
    @IsOptional()
    @IsString()
    [CreditGuardIntegrationType.RP]: string;
}

export class BatchMunicipalPayNominationsDto {
    @IsInt({ each: true })
    nominationIds: number[];

    @IsDefined()
    @Type(() => PaymentCvvDetails)
    cvv: PaymentCvvDetails;
}
